import { describe, it, expect, vi } from 'vitest'
import { type IEngineManagerFactory, GameEngineInitializer } from '@engine/core/gameEngineInitializer'
import type { Action } from '@loader/data/action'
import type { Loader } from '@loader/loader'
import { PostMessageActionHandler } from '@engine/actions/postMessageActionHandler'

function createEngine() {
  const loader = {
    gameLoader: {
      Game: {
        initialData: {
          language: 'en',
          startPage: 'start'
        },
        handlers: []
      }
    },
    handlerLoader: {} as any,
    tileLoader: {} as any,
    dialogLoader: {} as any,
    inputLoader: {} as any,
    pageLoader: {} as any,
    mapLoader: {} as any,
    languageLoader: { loadLanguage: vi.fn(), reset: vi.fn() }
  } as unknown as Loader
  const factory: IEngineManagerFactory = {
    createPageManager: (messageBus, stateManager, pageLoader, setIsLoading, setIsRunning) => {
      void messageBus
      void stateManager
      void pageLoader
      void setIsLoading
      void setIsRunning
      return { initialize: vi.fn(), switchPage: vi.fn(), cleanup: vi.fn() } as any
    },
    createMapManager: (messageBus, stateManager, mapLoader, tileLoader, translationService, executeAction, setIsLoading, setIsRunning) => {
      void messageBus
      void stateManager
      void mapLoader
      void tileLoader
      void translationService
      void executeAction
      void setIsLoading
      void setIsRunning
      return { initialize: vi.fn(), cleanup: vi.fn() } as any
    },
    createVirtualInputHandler: (gameLoader, inputLoader, messageBus) => {
      void gameLoader
      void inputLoader
      void messageBus
      return { initialize: vi.fn(), cleanup: vi.fn(), load: vi.fn(), getVirtualInput: vi.fn() } as any
    },
    createInputManager: (messageBus, stateManager, translationService, virtualInputHandler, executeAction, resolveCondition) => {
      void messageBus
      void stateManager
      void translationService
      void virtualInputHandler
      void executeAction
      void resolveCondition
      return { initialize: vi.fn(), cleanup: vi.fn(), update: vi.fn(), getInputMatrix: vi.fn() } as any
    },
    createOutputManager: (messageBus) => {
      void messageBus
      return { initialize: vi.fn(), cleanup: vi.fn(), getLastLines: vi.fn() } as any
    },
    createDialogManager: (messageBus, stateManager, translationService, dialogLoader, setIsLoading, setIsRunning, resolveCondition) => {
      void messageBus
      void stateManager
      void translationService
      void dialogLoader
      void setIsLoading
      void setIsRunning
      void resolveCondition
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
