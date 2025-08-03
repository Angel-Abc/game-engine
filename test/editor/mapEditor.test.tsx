/* @vitest-environment jsdom */
import { describe, it, expect, vi, afterEach, beforeAll } from 'vitest'
import { GameEditor } from '../../src/editor/components/GameEditor'
import { createRoot } from 'react-dom/client'
import { act } from 'react'

function flushPromises() {
  return new Promise((resolve) => {
    setTimeout(resolve, 0)
  })
}

const originalFetch = globalThis.fetch

afterEach(() => {
  vi.restoreAllMocks()
  globalThis.fetch = originalFetch
})

beforeAll(() => {
  ;(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true
})

describe('Map editor', () => {
  it('updates map json when tiles are placed', async () => {
    const initialMap = { width: 2, height: 2, map: [['', ''], ['', '']] }
    const data = {
      title: '',
      description: '',
      version: '',
      'initial-data': { language: '', 'start-page': '' },
      languages: {},
      pages: {},
      maps: { world: JSON.stringify(initialMap) },
      tiles: { grass: 'grass.json' },
      styling: [],
      handlers: [],
      'virtual-keys': [],
      'virtual-inputs': [],
    }
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ ok: true, json: vi.fn().mockResolvedValue(data) })
      .mockResolvedValue({ ok: true })
    ;(globalThis as { fetch: typeof fetch }).fetch = fetchMock as unknown as typeof fetch

    const container = document.createElement('div')
    document.body.appendChild(container)
    const root = createRoot(container)
    await act(async () => {
      root.render(<GameEditor />)
      await flushPromises()
    })

    const mapsSection = Array.from(container.querySelectorAll('h2'))
      .find((h) => h.textContent === 'Maps')!.parentElement as HTMLElement

    const select = mapsSection.querySelector('select.tile-picker') as HTMLSelectElement
    await act(async () => {
      select.value = 'grass'
      select.dispatchEvent(new Event('change', { bubbles: true }))
    })

    const firstCell = mapsSection.querySelector('.map-cell') as HTMLButtonElement
    await act(async () => {
      firstCell.click()
      await flushPromises()
    })

    const saveButton = Array.from(container.querySelectorAll('button')).find(
      (b) => b.textContent === 'Save',
    ) as HTMLButtonElement
    await act(async () => {
      saveButton.click()
      await flushPromises()
    })

    expect(fetchMock).toHaveBeenCalledTimes(2)
    const body = (fetchMock.mock.calls[1][1] as RequestInit).body as string
    const saved = JSON.parse(body)
    const savedMap = JSON.parse(saved.maps.world)
    expect(savedMap.map[0][0]).toBe('grass')
    await act(async () => {
      root.unmount()
    })
    container.remove()
  })
})
