import { logMessage, LogLevel } from '@utility/logMessage'
import { describe, it, expect, vi, afterEach } from 'vitest'

// ensure console methods are restored after each test
afterEach(() => {
  vi.restoreAllMocks()
})

describe('logMessage', () => {
  it('formats message and logs using console', () => {
    const spy = vi.spyOn(console, 'info').mockImplementation(() => {})

    const obj = { foo: 'bar' }
    const result = logMessage(LogLevel.info, 'hello {0} {1}', 'world', obj)

    expect(result).toBe('hello world %o')
    expect(spy).toHaveBeenCalledWith('\x1B[30m' + result, obj)
  })
})
