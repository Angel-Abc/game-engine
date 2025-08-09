/** @vitest-environment jsdom */
import { act } from 'react'
import { describe, it, expect } from 'vitest'
import { createRoot } from 'react-dom/client'
import { GameTree } from '@editor/app/gameTree'
import type { GameData, GameTreeSection } from '@editor/types'
import { SelectionProvider } from '@editor/context/SelectionContext'

;(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

describe('GameTree', () => {
  it('renders provided sections and items', () => {
    const game: GameData = { title: 'Test Game' }
    const sections: GameTreeSection[] = [{ name: 'pages', items: ['start'] }]
    const container = document.createElement('div')
    act(() => {
      createRoot(container).render(
        <SelectionProvider>
          <GameTree game={game} sections={sections} />
        </SelectionProvider>
      )
    })
    const spanTexts = Array.from(container.querySelectorAll('span')).map(
      (n) => n.textContent
    )
    expect(spanTexts).toContain('pages')
    expect(spanTexts).toContain('start')
    expect(spanTexts).not.toContain('maps')
  })
})
