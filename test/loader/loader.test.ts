import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { Loader } from '@loader/loader'

const rootData = {
  title: 'Test Game',
  description: 'test',
  version: '0.0.1',
  'initial-data': { language: 'en', 'start-page': 'page1' },
  languages: { en: 'en.json' },
  pages: { page1: 'page1.json' },
  styling: [],
  handlers: ['handlers.json']
}

const pageData = {
  id: 'page1',
  screen: { type: 'grid', width: 1, height: 1, components: [] }
}

const handlersData = [
  {
    message: 'TEST.MSG',
    action: { type: 'post-message', message: 'TARGET', payload: {} }
  }
]

let originalFetch: typeof fetch

beforeEach(() => {
  originalFetch = globalThis.fetch
})

afterEach(() => {
  globalThis.fetch = originalFetch
})

describe('Loader', () => {
  it('caches loaded pages', async () => {
    const fetchMock = vi.fn().mockImplementation(async (url: string) => {
      if (url.endsWith('/index.json')) {
        return { ok: true, json: vi.fn().mockResolvedValue(rootData) } as any
      }
      if (url.endsWith('/page1.json')) {
        return { ok: true, json: vi.fn().mockResolvedValue(pageData) } as any
      }
      throw new Error(`Unexpected url ${url}`)
    })
    globalThis.fetch = fetchMock as any

    const loader = new Loader('/data')
    await loader.loadRoot()

    const first = await loader.loadPage('page1')
    const second = await loader.loadPage('page1')

    expect(first).toEqual(pageData)
    expect(second).toBe(first)
    const pageCalls = fetchMock.mock.calls.filter(call => String(call[0]).endsWith('/page1.json'))
    expect(pageCalls.length).toBe(1)
  })

  it('throws when page key is invalid', async () => {
    const fetchMock = vi.fn().mockImplementation(async (url: string) => {
      if (url.endsWith('/index.json')) {
        return { ok: true, json: vi.fn().mockResolvedValue(rootData) } as any
      }
      throw new Error(`Unexpected url ${url}`)
    })
    globalThis.fetch = fetchMock as any

    const loader = new Loader('/data')
    await loader.loadRoot()

    await expect(loader.loadPage('missing')).rejects.toThrow()
  })

  it('caches loaded handlers', async () => {
    const fetchMock = vi.fn().mockImplementation(async (url: string) => {
      if (url.endsWith('/index.json')) {
        return { ok: true, json: vi.fn().mockResolvedValue(rootData) } as any
      }
      if (url.endsWith('/handlers.json')) {
        return { ok: true, json: vi.fn().mockResolvedValue(handlersData) } as any
      }
      throw new Error(`Unexpected url ${url}`)
    })
    globalThis.fetch = fetchMock as any

    const loader = new Loader('/data')
    await loader.loadRoot()

    const first = await loader.loadHandlers('handlers.json')
    const second = await loader.loadHandlers('handlers.json')

    expect(first).toEqual(handlersData)
    expect(second).toBe(first)
    const handlerCalls = fetchMock.mock.calls.filter(call => String(call[0]).endsWith('/handlers.json'))
    expect(handlerCalls.length).toBe(1)
  })
})
