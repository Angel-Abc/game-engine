import { describe, it, expect, vi } from 'vitest'
import { EventHandlerManager } from '@engine/common/eventHandlerManager'

describe('EventHandlerManager', () => {
  it('executes and clears registered listeners', () => {
    const manager = new EventHandlerManager()
    const fn1 = vi.fn()
    const fn2 = vi.fn()

    manager.addListener(fn1)
    manager.addListener(fn2)

    manager.clearListeners()
    expect(fn1).toHaveBeenCalled()
    expect(fn2).toHaveBeenCalled()

    fn1.mockClear()
    fn2.mockClear()
    manager.clearListeners()
    expect(fn1).not.toHaveBeenCalled()
    expect(fn2).not.toHaveBeenCalled()
  })
})
