import { describe, it, expect, vi } from 'vitest'
import { type IEngineManagerFactory, GameEngineInitializer } from '@engine/gameEngineInitializer'
import type { ILoader } from '@loader/loader'
import type { Action } from '@loader/data/action'
import { PostMessageActionHandler } from '@engine/actions/postMessageActionHandler'

function createEngine() {
  const loader = {
    Game: {
      initialData: {
        language: 'en'
      }
    }
  } as unknown as ILoader
  const factory: IEngineManagerFactory = {
    createPageManager: () => ({ initialize: vi.fn(), switchPage: vi.fn(), cleanup: vi.fn() }) as any,
    createMapManager: () => ({ initialize: vi.fn(), switchMap: vi.fn(), cleanup: vi.fn() }) as any,
    createVirtualInputHandler: () => ({ initialize: vi.fn(), cleanup: vi.fn(), load: vi.fn(), getVirtualInput: vi.fn() }) as any,
    createInputManager: () => ({ initialize: vi.fn(), cleanup: vi.fn(), update: vi.fn(), getInputMatrix: vi.fn() }) as any,
    createOutputManager: () => ({ initialize: vi.fn(), cleanup: vi.fn(), getLastLines: vi.fn() }) as any,
    createDialogManager: () => ({ initialize: vi.fn(), cleanup: vi.fn() }) as any,
    createTranslationService: () => ({ translate: vi.fn(), setLanguage: vi.fn() }) as any,
    createScriptRunner: () => ({ run: vi.fn() }) as any
  }
  const engine = GameEngineInitializer.initialize(loader, factory, {
    actionHandlers: [new PostMessageActionHandler()]
  })
  const bus = engine.MessageBus as any
  vi.spyOn(bus, 'postMessage')
  return { engine, bus }
}

describe('GameEngine.executeAction', () => {
  it('posts messages for post-message actions', () => {
    const { engine, bus } = createEngine()
    const action: Action = { type: 'post-message', message: 'TEST.MSG', payload: { a: 1 } }

    engine.executeAction(action)

    expect(bus.postMessage).toHaveBeenCalledWith({
      message: 'TEST.MSG',
      payload: { a: 1 }
    })
  })
})
