import { describe, it, expect, vi } from 'vitest'
import { loadOnce } from '@utils/loadOnce'

describe('loadOnce', () => {
  it('returns cached value without calling loader', async () => {
    const cache: Record<string, number> = { a: 1 }
    const loader = vi.fn()
    const setIsLoading = vi.fn()
    const setIsRunning = vi.fn()

    const result = await loadOnce(cache, 'a', loader, setIsLoading, setIsRunning)

    expect(result).toBe(1)
    expect(loader).not.toHaveBeenCalled()
    expect(setIsLoading).not.toHaveBeenCalled()
    expect(setIsRunning).not.toHaveBeenCalled()
  })

  it('loads value when not cached and sets state', async () => {
    const cache: Record<string, number> = {}
    const loader = vi.fn().mockResolvedValue(42)
    const setIsLoading = vi.fn()
    const setIsRunning = vi.fn()

    const result = await loadOnce(cache, 'b', loader, setIsLoading, setIsRunning)

    expect(result).toBe(42)
    expect(cache['b']).toBe(42)
    expect(loader).toHaveBeenCalledOnce()
    expect(setIsLoading).toHaveBeenCalledOnce()
    expect(setIsRunning).toHaveBeenCalledOnce()
  })

  it('calls setIsRunning even if loader throws', async () => {
    const cache: Record<string, number> = {}
    const loader = vi.fn().mockRejectedValue(new Error('fail'))
    const setIsLoading = vi.fn()
    const setIsRunning = vi.fn()

    await expect(loadOnce(cache, 'c', loader, setIsLoading, setIsRunning)).rejects.toThrow('fail')
    expect(setIsLoading).toHaveBeenCalledOnce()
    expect(setIsRunning).toHaveBeenCalledOnce()
    expect(cache['c']).toBeUndefined()
  })
})
