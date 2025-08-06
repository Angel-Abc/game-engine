import { describe, it, expect, vi } from 'vitest'
import { MapManager, type MapManagerServices } from '@engine/map/mapManager'
import { ChangeTracker } from '@engine/core/changeTracker'
import { StateManager } from '@engine/core/stateManager'
import { TrackedValue } from '@utils/trackedState'
import { GameEngineState } from '@engine/core/gameEngine'
import { MAP_SWITCHED_MESSAGE } from '@engine/messages/messages'
import type { ContextData } from '@engine/core/context'

function createMapManagerInstance() {
  const loader = {
    loadMap: vi.fn(async (_map: string) => ({
      key: _map,
      type: 'squares-map',
      width: 1,
      height: 1,
      tileSets: ['tileset'],
      tiles: {},
      map: [] as string[][]
    })),
    loadTileSet: vi.fn(async (_id: string) => ({
      id: _id,
      tiles: [
        { key: 'tile1', description: 'desc', color: 'blue' }
      ]
    }))
  }
  const messageBus = {
    registerMessageListener: vi.fn().mockReturnValue(() => {}),
    postMessage: vi.fn()
  }
  const stateManager = new StateManager<ContextData>({
    language: 'en',
    pages: {},
    maps: {},
    dialogs: {},
    tiles: {},
    tileSets: {},
    data: {
      activePage: null,
      activeDialog: null,
      isModalDialog: false,
      location: {
        mapName: null,
        mapSize: {
          width: 0,
          height: 0
        },
        position: {
          x: 0,
          y: 0
        }
      }
    }
  }, new ChangeTracker<ContextData>())
  const state = new TrackedValue<GameEngineState>('state', GameEngineState.init)

  const services: MapManagerServices = {
    mapLoader: loader as any,
    tileLoader: loader as any,
    messageBus: messageBus as any,
    stateManager,
    setIsLoading: () => { state.value = GameEngineState.loading },
    setIsRunning: () => { state.value = GameEngineState.running },
    executeAction: vi.fn()
  }

  const mapManager = new MapManager(services)
  return { mapManager, loader, stateManager, state, messageBus }
}

describe('MapManager', () => {
  it('loads a map only once', async () => {
    const { mapManager, loader } = createMapManagerInstance()

    await (mapManager as any).switchMap({ mapName: 'map1' })
    await (mapManager as any).switchMap({ mapName: 'map1' })

    expect(loader.loadMap).toHaveBeenCalledTimes(1)
  })

  it('loads tile sets and populates context.tiles', async () => {
    const { mapManager, loader, stateManager } = createMapManagerInstance()

    await (mapManager as any).switchMap({ mapName: 'map1' })

    expect(loader.loadTileSet).toHaveBeenCalledWith('tileset')
    expect(stateManager.state.tiles['tile1']).toEqual({
      key: 'tile1',
      description: 'desc',
      color: 'blue'
    })
  })

  it('posts MAP_SWITCHED_MESSAGE and updates state', async () => {
    const { mapManager, messageBus, state } = createMapManagerInstance()
    const transitions: GameEngineState[] = []
    state.subscribe(() => transitions.push(state.value))

    await (mapManager as any).switchMap({ mapName: 'map1' })

    expect(messageBus.postMessage).toHaveBeenCalledWith({
      message: MAP_SWITCHED_MESSAGE,
      payload: 'map1'
    })
    expect(transitions).toEqual([
      GameEngineState.loading,
      GameEngineState.running,
      GameEngineState.loading,
      GameEngineState.running,
    ])
    expect(state.value).toBe(GameEngineState.running)
  })
})
