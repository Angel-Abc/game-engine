import { describe, it, expect, vi } from 'vitest'
import { GameEngine, type IEngineManagerFactory } from '@engine/gameEngine'
import type { ILoader } from '@loader/loader'
import type { Action } from '@loader/data/action'

function createEngine() {
  const loader = {} as unknown as ILoader
  const factory: IEngineManagerFactory = {
    createPageManager: () => ({ switchPage: vi.fn(), cleanup: vi.fn() }) as any,
    createMapManager: () => ({ switchMap: vi.fn(), cleanup: vi.fn() }) as any,
    createVirtualInputHandler: () => ({ cleanup: vi.fn(), load: vi.fn(), getVirtualInput: vi.fn() }) as any,
    createInputManager: () => ({ cleanup: vi.fn(), update: vi.fn(), getInputMatrix: vi.fn() }) as any,
    createOutputManager: () => ({ cleanup: vi.fn(), getLastLines: vi.fn() }) as any,
    createDialogManager: () => ({ cleanup: vi.fn() }) as any,
    createScriptRunner: () => ({ run: vi.fn() }) as any
  }
  const engine = new GameEngine(loader, factory)
  const bus = {
    postMessage: vi.fn(),
    registerMessageListener: vi.fn(),
    registerNotificationMessage: vi.fn(),
    shutDown: vi.fn()
  } as any
  ;(engine as any).messageBus = bus
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
