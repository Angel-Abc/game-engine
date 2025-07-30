import { describe, it, expect, vi } from 'vitest'
import { GameEngine } from '@engine/gameEngine'
import type { ILoader } from '@loader/loader'
import type { Action } from '@loader/data/action'

function createEngine() {
  const loader = {} as unknown as ILoader
  const engine = new GameEngine(loader)
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
