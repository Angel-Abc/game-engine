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

afterEach(() => {
  vi.restoreAllMocks()
})

beforeAll(() => {
  ;(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true
})

describe('GameEditor string lists', () => {
  it('adds entries for styling, handlers, virtual keys, and virtual inputs', async () => {
    const data = {
      title: '',
      description: '',
      version: '',
      'initial-data': { language: '', 'start-page': '' },
      languages: {},
      pages: {},
      maps: {},
      tiles: {},
      dialogs: {},
      styling: [],
      handlers: [],
      'virtual-keys': [],
      'virtual-inputs': [],
    }
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, json: vi.fn().mockResolvedValue(data) })
    ;(globalThis as { fetch: typeof fetch }).fetch = fetchMock as unknown as typeof fetch

    const container = document.createElement('div')
    document.body.appendChild(container)
    await act(async () => {
      createRoot(container).render(<GameEditor />)
      await flushPromises()
    })

    const stylingSection = Array.from(container.querySelectorAll('h2'))
      .find((h) => h.textContent === 'Styling')!.parentElement as HTMLElement
    const handlersSection = Array.from(container.querySelectorAll('h2'))
      .find((h) => h.textContent === 'Handlers')!.parentElement as HTMLElement
    const virtualKeysSection = Array.from(container.querySelectorAll('h2'))
      .find((h) => h.textContent === 'Virtual Keys')!.parentElement as HTMLElement
    const virtualInputsSection = Array.from(container.querySelectorAll('h2'))
      .find((h) => h.textContent === 'Virtual Inputs')!.parentElement as HTMLElement

    expect(stylingSection.querySelectorAll('fieldset').length).toBe(0)
    expect(handlersSection.querySelectorAll('fieldset').length).toBe(0)
    expect(virtualKeysSection.querySelectorAll('fieldset').length).toBe(0)
    expect(virtualInputsSection.querySelectorAll('fieldset').length).toBe(0)

    const addStyling = Array.from(stylingSection.querySelectorAll('button')).find((b) => b.textContent?.includes('Add Styling'))!
    const addHandler = Array.from(handlersSection.querySelectorAll('button')).find((b) => b.textContent?.includes('Add Handler'))!
    const addVirtualKey = Array.from(virtualKeysSection.querySelectorAll('button')).find((b) => b.textContent?.includes('Add Virtual Key'))!
    const addVirtualInput = Array.from(virtualInputsSection.querySelectorAll('button')).find((b) => b.textContent?.includes('Add Virtual Input'))!

    await act(async () => {
      addStyling.click()
      addHandler.click()
      addVirtualKey.click()
      addVirtualInput.click()
      await flushPromises()
    })

    expect(stylingSection.querySelectorAll('fieldset').length).toBe(1)
    expect(handlersSection.querySelectorAll('fieldset').length).toBe(1)
    expect(virtualKeysSection.querySelectorAll('fieldset').length).toBe(1)
    expect(virtualInputsSection.querySelectorAll('fieldset').length).toBe(1)

    const stylingInput = stylingSection.querySelector('fieldset input') as HTMLInputElement
    const handlerInput = handlersSection.querySelector('fieldset input') as HTMLInputElement
    const virtualKeyInput = virtualKeysSection.querySelector('fieldset input') as HTMLInputElement
    const virtualInput = virtualInputsSection.querySelector('fieldset input') as HTMLInputElement

    expect(stylingInput.value).toBe('')
    expect(handlerInput.value).toBe('')
    expect(virtualKeyInput.value).toBe('')
    expect(virtualInput.value).toBe('')
  })

  it('removes entries when clicking remove for styling, handlers, virtual keys, and virtual inputs', async () => {
    const data = {
      title: '',
      description: '',
      version: '',
      'initial-data': { language: '', 'start-page': '' },
      languages: {},
      pages: {},
      maps: {},
      tiles: {},
      dialogs: {},
      styling: ['style.css'],
      handlers: ['handler.js'],
      'virtual-keys': ['A'],
      'virtual-inputs': ['input'],
    }
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, json: vi.fn().mockResolvedValue(data) })
    ;(globalThis as { fetch: typeof fetch }).fetch = fetchMock as unknown as typeof fetch

    const container = document.createElement('div')
    document.body.appendChild(container)
    await act(async () => {
      createRoot(container).render(<GameEditor />)
      await flushPromises()
    })

    const stylingSection = Array.from(container.querySelectorAll('h2'))
      .find((h) => h.textContent === 'Styling')!.parentElement as HTMLElement
    const handlersSection = Array.from(container.querySelectorAll('h2'))
      .find((h) => h.textContent === 'Handlers')!.parentElement as HTMLElement
    const virtualKeysSection = Array.from(container.querySelectorAll('h2'))
      .find((h) => h.textContent === 'Virtual Keys')!.parentElement as HTMLElement
    const virtualInputsSection = Array.from(container.querySelectorAll('h2'))
      .find((h) => h.textContent === 'Virtual Inputs')!.parentElement as HTMLElement

    expect(stylingSection.querySelectorAll('fieldset').length).toBe(1)
    expect(handlersSection.querySelectorAll('fieldset').length).toBe(1)
    expect(virtualKeysSection.querySelectorAll('fieldset').length).toBe(1)
    expect(virtualInputsSection.querySelectorAll('fieldset').length).toBe(1)

    const removeStyling = Array.from(stylingSection.querySelectorAll('button')).find((b) => b.textContent === 'Remove')!
    const removeHandler = Array.from(handlersSection.querySelectorAll('button')).find((b) => b.textContent === 'Remove')!
    const removeVirtualKey = Array.from(virtualKeysSection.querySelectorAll('button')).find((b) => b.textContent === 'Remove')!
    const removeVirtualInput = Array.from(virtualInputsSection.querySelectorAll('button')).find((b) => b.textContent === 'Remove')!

    await act(async () => {
      removeStyling.click()
      removeHandler.click()
      removeVirtualKey.click()
      removeVirtualInput.click()
      await flushPromises()
    })

    expect(stylingSection.querySelectorAll('fieldset').length).toBe(0)
    expect(handlersSection.querySelectorAll('fieldset').length).toBe(0)
    expect(virtualKeysSection.querySelectorAll('fieldset').length).toBe(0)
    expect(virtualInputsSection.querySelectorAll('fieldset').length).toBe(0)
  })
})

