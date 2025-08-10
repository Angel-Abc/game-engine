import { describe, it, expect } from 'vitest'
import { create2DArray } from '@utils/array'

describe('create2DArray', () => {
  it('creates a 2D array with specified dimensions and initial value', () => {
    const arr = create2DArray<number>(2, 3, 0)
    expect(arr.length).toBe(2)
    arr.forEach(row => {
      expect(row.length).toBe(3)
      row.forEach(value => expect(value).toBe(0))
    })
  })

  it('creates distinct row arrays', () => {
    const arr = create2DArray<object>(2, 2, {})
    expect(arr[0]).not.toBe(arr[1])
  })
})
