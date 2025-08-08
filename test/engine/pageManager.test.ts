import { describe, it, expect, vi } from 'vitest'
import { PageManager, type PageManagerServices } from '@engine/page/pageManager'
import { ChangeTracker } from '@engine/core/changeTracker'
import { StateManager } from '@engine/core/stateManager'
import { TrackedValue } from '@utils/trackedState'
import { GameEngineState } from '@engine/core/gameEngine'
import type { ContextData } from '@engine/core/context'

function createPageManagerInstance() {
  const loader = {
    loadPage: vi.fn(async (page: string) => ({ id: page }))
  }
  const messageBus = {
    registerMessageListener: vi.fn().mockReturnValue(() => {}),
    postMessage: vi.fn()
  }
  const stateManager = new StateManager<ContextData>({
    language: 'en',
    pages: {},
    maps: {},
    dialogSets: {},
    tiles: {},
    tileSets: {},
    dialogs: {
      activeDialog: null,
      isModalDialog: false,
      dialogSets: {}
    },
    data: {
      activePage: null,
      location: {
        mapName: null,
        position: { x: 0, y: 0 },
        mapSize: { width: 0, height: 0 }
      }
    }
  }, new ChangeTracker<ContextData>())
  const state = new TrackedValue<GameEngineState>('state', GameEngineState.init)

  const services: PageManagerServices = {
    pageLoader: loader as any,
    messageBus: messageBus as any,
    stateManager,
    setIsLoading: () => { state.value = GameEngineState.loading },
    setIsRunning: () => { state.value = GameEngineState.running }
  }

  const pageManager = new PageManager(services)
  return { pageManager, loader, stateManager, state }
}

describe('PageManager', () => {
  it('loads a page only once', async () => {
    const { pageManager, loader } = createPageManagerInstance()

    await pageManager.switchPage('page1')
    await pageManager.switchPage('page1')

    expect(loader.loadPage).toHaveBeenCalledTimes(1)
  })

  it('updates game state to loading then running', async () => {
    const { pageManager, state } = createPageManagerInstance()
    const transitions: GameEngineState[] = []
    state.subscribe(() => transitions.push(state.value))

    await pageManager.switchPage('page1')

    expect(transitions).toEqual([GameEngineState.loading, GameEngineState.running])
    expect(state.value).toBe(GameEngineState.running)
  })
})
