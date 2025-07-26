import { describe, it, expect, vi } from 'vitest'
import { TrackedValue } from '@utils/trackedState'

describe('TrackedValue', () => {
  it('notifies subscribers and callback on value change', () => {
    const callback = vi.fn()
    const tracked = new TrackedValue<number>('num', 0, callback)
    const subscriber = vi.fn()
    const unsubscribe = tracked.subscribe(subscriber)

    tracked.value = 1
    expect(subscriber).toHaveBeenCalledTimes(1)
    expect(callback).toHaveBeenCalledWith(1, 0)

    subscriber.mockClear()
    callback.mockClear()
    unsubscribe()

    tracked.value = 2
    expect(subscriber).not.toHaveBeenCalled()
    expect(callback).toHaveBeenCalledWith(2, 1)
  })
})
