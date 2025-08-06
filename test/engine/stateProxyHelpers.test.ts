import { describe, it, expect } from 'vitest'
import { ChangeTracker } from '@engine/core/changeTracker'
import { buildPath, cacheProxy, getCachedProxy, trackChange } from '@engine/core/stateProxyHelpers'

describe('stateProxyHelpers', () => {
  it('builds paths correctly', () => {
    expect(buildPath(null, 'prop')).toBe('prop')
    expect(buildPath('parent', 'child')).toBe('parent.child')
  })

  it('caches and retrieves proxies', () => {
    const cache = new WeakMap<object, unknown>()
    const target: Record<string, unknown> = {}
    const proxy: Record<string, unknown> = { a: 1 }
    expect(getCachedProxy(cache, target)).toBeUndefined()
    cacheProxy(cache, target, proxy)
    expect(getCachedProxy(cache, target)).toBe(proxy)
  })

  it('tracks primitive and object changes', () => {
    interface Data extends Record<string, unknown> { value: unknown }
    const tracker = new ChangeTracker<Data>()
    trackChange(tracker, 'value', 1, null)
    const objOld = { a: 0 }
    const objNew = { a: 1 }
    trackChange(tracker, 'value', objNew, objOld)
    const changes = tracker.changes[tracker.activeTurnIndex].changes
    expect(changes[0]).toEqual({ path: 'value', newValue: 1, oldValue: null })
    expect(changes[1]).toEqual({ path: 'value', newValue: { a: 1 }, oldValue: { a: 0 } })
  })
})
