import { describe, it, expect, vi } from 'vitest'
import { MessageDrivenManager } from '@engine/common/messageDrivenManager'

class TestManager extends MessageDrivenManager {
  private bus: any
  private handler: (msg: any) => void
  constructor(bus: any, handler: (msg: any) => void) {
    super()
    this.bus = bus
    this.handler = handler
  }
  public initialize(): void {
    this.registerMessageListener(this.bus, 'TEST', this.handler)
  }
}

describe('MessageDrivenManager', () => {
  it('clears listeners on cleanup', () => {
    const handlers: ((message: { message: string; payload: unknown }) => void)[] = []
    const messageBus = {
      registerMessageListener: vi.fn((_msg: string, handler: (message: { message: string; payload: unknown }) => void) => {
        handlers.push(handler)
        return () => {
          const index = handlers.indexOf(handler)
          if (index >= 0) handlers.splice(index, 1)
        }
      }),
      postMessage: (message: { message: string; payload: unknown }) => {
        handlers.forEach(h => h(message))
      }
    }

    const fn = vi.fn()
    const manager = new TestManager(messageBus, fn)

    manager.initialize()
    messageBus.postMessage({ message: 'TEST', payload: undefined })
    expect(fn).toHaveBeenCalledTimes(1)

    manager.cleanup()
    messageBus.postMessage({ message: 'TEST', payload: undefined })
    expect(fn).toHaveBeenCalledTimes(1)
  })
})
