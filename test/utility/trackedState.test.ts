import { describe, it, expect, vi, afterEach } from 'vitest'
import { TrackedValue } from '@utility/trackedState'

vi.mock('@utility/logMessage', () => ({
  logDebug: vi.fn()
}))

afterEach(() => {
  vi.restoreAllMocks()
})

describe('TrackedValue', () => {
  it('notifies subscribers and callback on value change', () => {
    const callback = vi.fn()
    const tracked = new TrackedValue<number>('score', 1, callback)

    const subscriber = vi.fn()
    const unsubscribe = tracked.subscribe(subscriber)

    tracked.value = 2

    expect(callback).toHaveBeenCalledWith(2, 1)
    expect(subscriber).toHaveBeenCalledTimes(1)

    subscriber.mockClear()
    callback.mockClear()

    // setting same value should not trigger callbacks
    tracked.value = 2
    expect(callback).not.toHaveBeenCalled()
    expect(subscriber).not.toHaveBeenCalled()

    // unsubscribe and change again
    unsubscribe()
    tracked.value = 3
    expect(subscriber).not.toHaveBeenCalled()
  })
})
