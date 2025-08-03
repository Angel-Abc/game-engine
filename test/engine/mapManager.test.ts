import { describe, it, expect, vi } from 'vitest'
import { MapManager } from '@engine/mapManager'
import { ChangeTracker } from '@engine/changeTracker'
import { StateManager } from '@engine/stateManager'
import { TrackedValue } from '@utils/trackedState'
import { GameEngineState, type ContextData, type IGameEngine } from '@engine/gameEngine'
import { MAP_SWITCHED_MESSAGE } from '@engine/messages'
import type { IPageManager } from '@engine/pageManager'

function createTestEngine() {
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
    tiles: {},
    tileSets: {},
    data: { 
      activePage: null, 
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

  const engine: IGameEngine = {
    async start() {},
    cleanup() {},
    executeAction: vi.fn(),
    resolveCondition: vi.fn().mockReturnValue(true),
    setIsLoading() { state.value = GameEngineState.loading },
    setIsRunning() { state.value = GameEngineState.running },
    get StateManager() { return stateManager },
    get State() { return state },
    get TranslationService() { return {} as any },
    get Loader() { return loader as any },
    get MessageBus() { return messageBus as any },
    get PageManager(): IPageManager { return {} as IPageManager },
    get MapManager() { return {} as any },
    get InputManager() { return {} as any },
    get ScriptRunner() { return {} as any },
    get VirtualInputHandler() { return {} as any },

  }

  const mapManager = new MapManager(engine)
  return { mapManager, loader, stateManager, state, messageBus }
}

describe('MapManager', () => {
  it('loads a map only once', async () => {
    const { mapManager, loader } = createTestEngine()

    await mapManager.switchMap('map1')
    await mapManager.switchMap('map1')

    expect(loader.loadMap).toHaveBeenCalledTimes(1)
  })

  it('loads tile sets and populates context.tiles', async () => {
    const { mapManager, loader, stateManager } = createTestEngine()

    await mapManager.switchMap('map1')

    expect(loader.loadTileSet).toHaveBeenCalledWith('tileset')
    expect(stateManager.state.tiles['tile1']).toEqual({
      key: 'tile1',
      description: 'desc',
      color: 'blue'
    })
  })

  it('posts MAP_SWITCHED_MESSAGE and updates state', async () => {
    const { mapManager, messageBus, state } = createTestEngine()
    const transitions: GameEngineState[] = []
    state.subscribe(() => transitions.push(state.value))

    await mapManager.switchMap('map1')

    expect(messageBus.postMessage).toHaveBeenCalledWith({
      message: MAP_SWITCHED_MESSAGE,
      payload: 'map1'
    })
    expect(transitions).toEqual([GameEngineState.loading, GameEngineState.running])
    expect(state.value).toBe(GameEngineState.running)
  })
})
