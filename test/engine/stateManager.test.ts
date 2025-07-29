import { describe, it, expect } from 'vitest'
import { ChangeTracker } from '@engine/changeTracker'
import { StateManager } from '@engine/stateManager'

interface Data extends Record<string, unknown> { count: number }

describe('StateManager', () => {
  it('rolls back changes turn by turn', () => {
    const tracker = new ChangeTracker<Data>()
    const manager = new StateManager<Data>({ count: 0 }, tracker)

    manager.state.count = 1
    manager.commitTurn()
    manager.state.count = 2

    manager.rollbackTurn()
    expect(manager.state.count).toBe(1)
    manager.rollbackTurn()
    expect(manager.state.count).toBe(0)
  })

  it('saves and loads state', () => {
    const tracker = new ChangeTracker<Data>()
    const manager = new StateManager<Data>({ count: 0 }, tracker)

    manager.state.count = 1
    manager.commitTurn()
    manager.state.count = 2
    const save = manager.save()

    const tracker2 = new ChangeTracker<Data>()
    const manager2 = new StateManager<Data>({ count: 0 }, tracker2)
    manager2.load(save)
    expect(manager2.state.count).toBe(2)
    manager2.rollbackTurn()
    expect(manager2.state.count).toBe(1)
  })
})
