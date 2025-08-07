import { describe, it, expect, vi } from 'vitest'
import { type IEngineManagerFactory, GameEngineInitializer } from '@engine/core/gameEngineInitializer'
import type { Action } from '@loader/data/action'
import type { Loader } from '@loader/loader'
import { PostMessageActionHandler } from '@engine/actions/postMessageActionHandler'

function createEngine() {
  const loader = {
    Game: {
      initialData: {
        language: 'en',
        startPage: 'start',
        handlers: []
      }
    },
    pageLoader: {} as any,
    mapLoader: {} as any,
    languageLoader: { loadLanguage: vi.fn(), reset: vi.fn() },
    loadRoot: vi.fn(),
    reset: vi.fn(),
    loadHandlers: vi.fn(),
    loadTileSet: vi.fn(),
    loadDialog: vi.fn(),
    loadVirtualKeys: vi.fn(),
    loadVirtualInputs: vi.fn(),
    Styling: []
  } as unknown as Loader
  const factory: IEngineManagerFactory = {
    createPageManager: (engine, messageBus, stateManager, pageLoader) => {
      void engine
      void messageBus
      void stateManager
      void pageLoader
      return { initialize: vi.fn(), switchPage: vi.fn(), cleanup: vi.fn() } as any
    },
    createMapManager: (engine, messageBus, stateManager, mapLoader, tileLoader) => {
      void engine
      void messageBus
      void stateManager
      void mapLoader
      void tileLoader
      return { initialize: vi.fn(), cleanup: vi.fn() } as any
    },
    createVirtualInputHandler: (gameLoader, inputLoader, messageBus) => {
      void gameLoader
      void inputLoader
      void messageBus
      return { initialize: vi.fn(), cleanup: vi.fn(), load: vi.fn(), getVirtualInput: vi.fn() } as any
    },
    createInputManager: (engine, messageBus, stateManager, translationService, virtualInputHandler) => {
      void engine
      void messageBus
      void stateManager
      void translationService
      void virtualInputHandler
      return { initialize: vi.fn(), cleanup: vi.fn(), update: vi.fn(), getInputMatrix: vi.fn() } as any
    },
    createOutputManager: (engine, messageBus) => {
      void engine
      void messageBus
      return { initialize: vi.fn(), cleanup: vi.fn(), getLastLines: vi.fn() } as any
    },
    createDialogManager: (engine, messageBus, stateManager, translationService, dialogLoader) => {
      void engine
      void messageBus
      void stateManager
      void translationService
      void dialogLoader
      return { initialize: vi.fn(), cleanup: vi.fn() } as any
    },
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
