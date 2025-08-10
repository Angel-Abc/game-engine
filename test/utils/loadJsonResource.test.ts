import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { z } from 'zod'
import { loadJsonResource } from '@utils/loadJsonResource'

describe('loadJsonResource', () => {
  const url = 'http://example.com/data.json'
  const schema = z.object({ a: z.number() })
  let originalFetch: typeof fetch

  beforeEach(() => {
    originalFetch = globalThis.fetch
  })

  afterEach(() => {
    globalThis.fetch = originalFetch
  })

  it('loads and validates json', async () => {
    const json = { a: 5 }
    const response = { ok: true, json: vi.fn().mockResolvedValue(json) } as unknown as Response
    const fetchMock = vi.fn().mockResolvedValue(response)
    globalThis.fetch = fetchMock as any

    const result = await loadJsonResource(url, schema)
    expect(result).toEqual(json)
    expect(fetchMock).toHaveBeenCalledWith(url)
  })

  it('throws when validation fails', async () => {
    const response = { ok: true, json: vi.fn().mockResolvedValue({ a: 'x' }) } as unknown as Response
    globalThis.fetch = vi.fn().mockResolvedValue(response) as any

    await expect(loadJsonResource(url, schema)).rejects.toThrow()
  })
})
