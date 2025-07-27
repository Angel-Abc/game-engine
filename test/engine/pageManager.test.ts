import { describe, it, expect, vi } from 'vitest'
import { PageManager } from '../../src/engine/pageManager'
import { ChangeTracker } from '../../src/engine/changeTracker'
import { StateManager } from '../../src/engine/stateManager'
import { TrackedValue } from '@utils/trackedState'
import { GameEngineState, type ContextData, type IGameEngine } from '../../src/engine/gameEngine'
import type { IPageManager } from '../../src/engine/pageManager'

function createTestEngine() {
  const loader = {
    loadPage: vi.fn(async (page: string) => ({ id: page }))
  }
  const messageBus = {
    registerMessageListener: vi.fn().mockReturnValue(() => {})
  }
  const stateManager = new StateManager<ContextData>({ language: 'en', pages: {}, data: { activePage: null } }, new ChangeTracker<ContextData>())
  const state = new TrackedValue<GameEngineState>('state', GameEngineState.init)

  const engine: IGameEngine = {
    async start() {},
    cleanup() {},
    get StateManager() { return stateManager },
    get State() { return state },
    get TranslationService() { return {} as any },
    get Loader() { return loader as any },
    get MessageBus() { return messageBus as any },
    get PageManager(): IPageManager { return {} as IPageManager }
  }

  const pageManager = new PageManager(engine)
  return { pageManager, loader, stateManager, state }
}

describe('PageManager', () => {
  it('loads a page only once', async () => {
    const { pageManager, loader } = createTestEngine()

    await pageManager.switchPage('page1')
    await pageManager.switchPage('page1')

    expect(loader.loadPage).toHaveBeenCalledTimes(1)
  })

  it('updates game state to loading then running', async () => {
    const { pageManager, state } = createTestEngine()
    const transitions: GameEngineState[] = []
    state.subscribe(() => transitions.push(state.value))

    await pageManager.switchPage('page1')

    expect(transitions).toEqual([GameEngineState.loading, GameEngineState.running])
    expect(state.value).toBe(GameEngineState.running)
  })
})
