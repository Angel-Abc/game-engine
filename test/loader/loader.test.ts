import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { Loader } from '@loader/loader'

const rootData = {
  title: 'Test Game',
  description: 'test',
  version: '0.0.1',
  'initial-data': { language: 'en', 'start-page': 'page1' },
  languages: { en: ['en.json'] },
  pages: { page1: 'page1.json' },
  maps: { start: 'start.json' },
  tiles: { outdoor: 'tiles.json' },
  dialogs: {},
  styling: [],
  handlers: ['handlers.json'],
  'virtual-keys': ['virtual-keys.json'],
  'virtual-inputs': ['virtual-inputs.json']
}

const languageSchemaData = {
  id: 'en',
  translations: { greeting: 'Hello' }
}

const languageData = {
  id: 'en',
  translations: { greeting: 'Hello' }
}

const pageData = {
  id: 'page1',
  screen: { type: 'grid', width: 1, height: 1, components: [] },
  inputs: []
}

const handlersData = [
  {
    message: 'TEST.MSG',
    action: { type: 'post-message', message: 'TARGET', payload: {} }
  }
]

const tileSetData = {
  id: 'outdoor',
  tiles: [
    { key: 'tile1', description: 'desc', color: 'blue' }
  ]
}

const mapSchemaData = {
  key: 'start',
  type: 'squares-map',
  width: 1,
  height: 1,
  tileSets: [],
  tiles: [],
  map: [] as string[],
}

const mapData = {
  key: 'start',
  type: 'squares-map',
  width: 1,
  height: 1,
  tileSets: [],
  tiles: {},
  map: [] as string[][]
}

const virtualKeysSchemaData = [
  { virtualKey: 'VK_A', keyCode: 'KeyA' }
]
const virtualKeysData = [
  { virtualKey: 'VK_A', keyCode: 'KeyA', shift: false, ctrl: false, alt: false }
]

const virtualInputsData = [
  { virtualInput: 'VI_LEFT', virtualKeys: ['VK_A'], label: 'A' }
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
    await loader.gameLoader.loadRoot()

    const first = await loader.pageLoader.loadPage('page1')
    const second = await loader.pageLoader.loadPage('page1')

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
    await loader.gameLoader.loadRoot()

    await expect(loader.pageLoader.loadPage('missing')).rejects.toThrow()
  })

  it('caches loaded languages', async () => {
    const fetchMock = vi.fn().mockImplementation(async (url: string) => {
      if (url.endsWith('/index.json')) {
        return { ok: true, json: vi.fn().mockResolvedValue(rootData) } as any
      }
      if (url.endsWith('/en.json')) {
        return { ok: true, json: vi.fn().mockResolvedValue(languageSchemaData) } as any
      }
      throw new Error(`Unexpected url ${url}`)
    })
    globalThis.fetch = fetchMock as any

    const loader = new Loader('/data')
    await loader.gameLoader.loadRoot()

    const first = await loader.languageLoader.loadLanguage('en')
    const second = await loader.languageLoader.loadLanguage('en')

    expect(first).toEqual(languageData)
    expect(second).toBe(first)
    const languageCalls = fetchMock.mock.calls.filter(call => String(call[0]).endsWith('/en.json'))
    expect(languageCalls.length).toBe(1)
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
    await loader.gameLoader.loadRoot()

    const first = await loader.handlerLoader.loadHandlers('handlers.json')
    const second = await loader.handlerLoader.loadHandlers('handlers.json')

    expect(first).toEqual(handlersData)
    expect(second).toBe(first)
    const handlerCalls = fetchMock.mock.calls.filter(call => String(call[0]).endsWith('/handlers.json'))
    expect(handlerCalls.length).toBe(1)
  })

  it('caches loaded tile sets', async () => {
    const fetchMock = vi.fn().mockImplementation(async (url: string) => {
      if (url.endsWith('/index.json')) {
        return { ok: true, json: vi.fn().mockResolvedValue(rootData) } as any
      }
      if (url.endsWith('/tiles.json')) {
        return { ok: true, json: vi.fn().mockResolvedValue(tileSetData) } as any
      }
      throw new Error(`Unexpected url ${url}`)
    })
    globalThis.fetch = fetchMock as any

    const loader = new Loader('/data')
    await loader.gameLoader.loadRoot()

    const first = await loader.tileLoader.loadTileSet('outdoor')
    const second = await loader.tileLoader.loadTileSet('outdoor')

    expect(first).toEqual(tileSetData)
    expect(second).toBe(first)
    const tileCalls = fetchMock.mock.calls.filter(call => String(call[0]).endsWith('/tiles.json'))
    expect(tileCalls.length).toBe(1)
  })

  it('caches loaded maps', async () => {
    const fetchMock = vi.fn().mockImplementation(async (url: string) => {
      if (url.endsWith('/index.json')) {
        return { ok: true, json: vi.fn().mockResolvedValue(rootData) } as any
      }
      if (url.endsWith('/start.json')) {
        return { ok: true, json: vi.fn().mockResolvedValue(mapSchemaData) } as any
      }
      throw new Error(`Unexpected url ${url}`)
    })
    globalThis.fetch = fetchMock as any

    const loader = new Loader('/data')
    await loader.gameLoader.loadRoot()

    const first = await loader.mapLoader.loadMap('start')
    const second = await loader.mapLoader.loadMap('start')

    expect(first).toEqual(mapData)
    expect(second).toBe(first)
    const mapCalls = fetchMock.mock.calls.filter(call => String(call[0]).endsWith('/start.json'))
    expect(mapCalls.length).toBe(1)
  })

  it('caches loaded virtual keys', async () => {
    const fetchMock = vi.fn().mockImplementation(async (url: string) => {
      if (url.endsWith('/index.json')) {
        return { ok: true, json: vi.fn().mockResolvedValue(rootData) } as any
      }
      if (url.endsWith('/virtual-keys.json')) {
        return { ok: true, json: vi.fn().mockResolvedValue(virtualKeysSchemaData) } as any
      }
      throw new Error(`Unexpected url ${url}`)
    })
    globalThis.fetch = fetchMock as any

    const loader = new Loader('/data')
    await loader.gameLoader.loadRoot()

    const first = await loader.inputLoader.loadVirtualKeys('virtual-keys.json')
    const second = await loader.inputLoader.loadVirtualKeys('virtual-keys.json')

    expect(first).toEqual(virtualKeysData)
    expect(second).toBe(first)
    const keyCalls = fetchMock.mock.calls.filter(call => String(call[0]).endsWith('/virtual-keys.json'))
    expect(keyCalls.length).toBe(1)
  })

  it('caches loaded virtual inputs', async () => {
    const fetchMock = vi.fn().mockImplementation(async (url: string) => {
      if (url.endsWith('/index.json')) {
        return { ok: true, json: vi.fn().mockResolvedValue(rootData) } as any
      }
      if (url.endsWith('/virtual-inputs.json')) {
        return { ok: true, json: vi.fn().mockResolvedValue(virtualInputsData) } as any
      }
      throw new Error(`Unexpected url ${url}`)
    })
    globalThis.fetch = fetchMock as any

    const loader = new Loader('/data')
    await loader.gameLoader.loadRoot()

    const first = await loader.inputLoader.loadVirtualInputs('virtual-inputs.json')
    const second = await loader.inputLoader.loadVirtualInputs('virtual-inputs.json')

    expect(first).toEqual(virtualInputsData)
    expect(second).toBe(first)
    const inputCalls = fetchMock.mock.calls.filter(call => String(call[0]).endsWith('/virtual-inputs.json'))
    expect(inputCalls.length).toBe(1)
  })
})
