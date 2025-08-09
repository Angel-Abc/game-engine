/** @vitest-environment jsdom */
import { act } from 'react'
import { describe, it, expect } from 'vitest'
import { createRoot } from 'react-dom/client'
import { GameEditor } from '@editor/app/gameEditor'
import type { GameData } from '@editor/types'

;(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

describe('GameEditor', () => {
  it('renders language and start page dropdowns', () => {
    const game: GameData = {
      title: 'Test Game',
      languages: { en: [], fr: [] },
      pages: {
        start: {
          id: 'start',
          fileName: 'pages/start.json',
          inputs: [],
          screen: { type: 'grid', width: 1, height: 1, components: [] },
        },
        other: {
          id: 'other',
          fileName: 'pages/other.json',
          inputs: [],
          screen: { type: 'grid', width: 1, height: 1, components: [] },
        },
      },
      ['initial-data']: { language: 'en', 'start-page': 'start' },
    }
    const container = document.createElement('div')
    act(() => {
      createRoot(container).render(<GameEditor game={game} />)
    })
    const selects = container.querySelectorAll('select')
    expect(selects).toHaveLength(2)
    const languageSelect = selects[0] as HTMLSelectElement
    expect(languageSelect.value).toBe('en')
    const options = Array.from(languageSelect.options).map((o) => o.value)
    expect(options).toContain('fr')
    const startPageSelect = selects[1] as HTMLSelectElement
    expect(startPageSelect.value).toBe('start')
    const pageOptions = Array.from(startPageSelect.options).map((o) => o.value)
    expect(pageOptions).toContain('other')
  })
})
