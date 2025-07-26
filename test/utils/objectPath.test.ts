import { describe, it, expect } from 'vitest'
import { setValueAtPath } from '@utils/objectPath'

describe('setValueAtPath', () => {
  it('sets value on existing path', () => {
    const obj: Record<string, any> = { a: { b: { c: 1 } } }
    setValueAtPath(obj, 'a.b.c', 5)
    expect(obj.a.b.c).toBe(5)
  })

  it('ignores missing intermediate keys', () => {
    const obj: Record<string, any> = {}
    setValueAtPath(obj, 'x.y', 3)
    expect(obj.x).toBeUndefined()
  })
})
