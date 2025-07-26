import { describe, it, expect } from 'vitest'
import { hasMapChanged, updateMap } from '../../src/utils/map'

describe('hasMapChanged', () => {
  it('returns false for identical maps', () => {
    const a = new Map([['x', 1], ['y', 2]])
    const b = new Map([['x', 1], ['y', 2]])
    expect(hasMapChanged(a, b, (x, y) => x === y)).toBe(false)
  })

  it('detects size difference', () => {
    const a = new Map([['x', 1]])
    const b = new Map([['x', 1], ['y', 2]])
    expect(hasMapChanged(a, b, (x, y) => x === y)).toBe(true)
  })

  it('detects value difference via comparator', () => {
    const a = new Map([['x', 1]])
    const b = new Map([['x', 2]])
    expect(hasMapChanged(a, b, (x, y) => x === y)).toBe(true)
  })
})

describe('updateMap', () => {
  it('clears target and copies from source using clone', () => {
    const target = new Map<string, number>([['a', 1]])
    const source = new Map<string, number>([['b', 2]])
    updateMap(target, source, (v) => v)

    expect(target.size).toBe(1)
    expect(target.get('b')).toBe(2)
    expect(target.has('a')).toBe(false)
  })
})
