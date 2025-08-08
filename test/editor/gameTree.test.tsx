/** @vitest-environment jsdom */
import { describe, it, expect, vi } from 'vitest'
import { createRoot } from 'react-dom/client'
import { act } from 'react'
import { GameTreeView } from '@editor/components/GameTree'
import type { Game } from '@editor/data/game'

// React requires this flag for `act` in testing environments
const reactEnv = globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT?: boolean }
reactEnv.IS_REACT_ACT_ENVIRONMENT = true

const sampleGame: Game = {
  title: '',
  description: '',
  version: '',
  initialData: { language: 'en', startPage: 'start' },
  languages: { en: ['hello'] },
  pages: { start: 'start.json' },
  maps: { world: 'world.json' },
  tiles: { grass: 'grass.json' },
  dialogs: { intro: 'intro.json' },
  handlers: ['handleStart'],
  virtualKeys: ['A'],
  virtualInputs: ['jump'],
}

describe('GameTreeView', () => {
  it('renders game categories and items', () => {
    const onSelect = vi.fn()
    const container = document.createElement('div')
    document.body.appendChild(container)
    const root = createRoot(container)
    act(() => {
      root.render(<GameTreeView game={sampleGame} onSelect={onSelect} />)
    })
    const buttons = Array.from(container.querySelectorAll('button')).map((b) => b.textContent)
    expect(buttons).toContain('pages')
    expect(buttons).toContain('start')
    expect(buttons).toContain('maps')
    expect(buttons).toContain('world')
  })

  it('emits node path on selection', () => {
    const onSelect = vi.fn()
    const container = document.createElement('div')
    document.body.appendChild(container)
    const root = createRoot(container)
    act(() => {
      root.render(<GameTreeView game={sampleGame} onSelect={onSelect} />)
    })
    const startButton = Array.from(container.querySelectorAll('button')).find(
      (b) => b.textContent === 'start',
    ) as HTMLButtonElement
    act(() => {
      startButton.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })
    expect(onSelect).toHaveBeenCalledWith(['pages', 'start'])
  })
})

