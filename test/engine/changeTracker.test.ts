import { describe, it, expect } from 'vitest'
import { ChangeTracker } from '@engine/changeTracker'

interface Data extends Record<string, unknown> { value: number }

describe('ChangeTracker', () => {
  it('undo reverts changes for each turn', () => {
    const tracker = new ChangeTracker<Data>()
    const data: Data = { value: 0 }

    tracker.trackChange({ path: 'value', oldValue: 0, newValue: 1 })
    data.value = 1
    tracker.startNewTurn()
    tracker.trackChange({ path: 'value', oldValue: 1, newValue: 2 })
    data.value = 2

    tracker.undo(data)
    expect(data.value).toBe(1)
    tracker.undo(data)
    expect(data.value).toBe(0)
  })

  it('save and load restore state with consolidated turns', () => {
    const tracker = new ChangeTracker<Data>(2)
    const data: Data = { value: 0 }

    tracker.trackChange({ path: 'value', oldValue: 0, newValue: 1 })
    data.value = 1
    tracker.startNewTurn()

    tracker.trackChange({ path: 'value', oldValue: 1, newValue: 2 })
    data.value = 2
    tracker.startNewTurn()

    tracker.trackChange({ path: 'value', oldValue: 2, newValue: 3 })
    data.value = 3

    const save = tracker.save()

    const tracker2 = new ChangeTracker<Data>()
    const data2: Data = { value: 0 }
    tracker2.load(data2, save)
    expect(data2.value).toBe(3)
  })
})
