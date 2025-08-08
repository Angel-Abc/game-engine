/** @vitest-environment jsdom */
import { describe, it, expect, vi } from 'vitest'
import { createRoot } from 'react-dom/client'
import { act } from 'react'
import { GameJsonPage } from '@editor/components/GameJsonPage'
import EditorContext from '@editor/context/EditorContext'
import type { Game } from '@editor/data/game'

vi.mock('@editor/services/api', () => ({
  saveGame: vi.fn().mockResolvedValue('Saved'),
}))

// React requires this flag for `act` in testing environments
const reactEnv = globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT?: boolean }
reactEnv.IS_REACT_ACT_ENVIRONMENT = true

describe('GameJsonPage', () => {
  it('renders JSON preview and saves game', async () => {
    const game: Game = {
      title: 'test',
      description: '',
      version: '',
      initialData: { language: 'en', startPage: 'start' },
      languages: {},
      pages: {},
      maps: {},
      tiles: {},
      dialogs: {},
      handlers: [],
      virtualKeys: [],
      virtualInputs: [],
    }
    const contextValue = {
      game,
      selectedPath: [],
      setSelectedPath: () => {},
      setGame: () => {},
    }

    const container = document.createElement('div')
    document.body.appendChild(container)
    const root = createRoot(container)
    const { saveGame } = await import('@editor/services/api')

    act(() => {
      root.render(
        <EditorContext.Provider value={contextValue}>
          <GameJsonPage />
        </EditorContext.Provider>,
      )
    })

    const pre = container.querySelector('pre')
    expect(pre?.textContent).toContain('"title": "test"')

    const button = container.querySelector('button') as HTMLButtonElement
    await act(async () => {
      button.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })

    expect(saveGame).toHaveBeenCalledWith(JSON.stringify(game))
    expect(container.textContent).toContain('Saved')
  })
})

