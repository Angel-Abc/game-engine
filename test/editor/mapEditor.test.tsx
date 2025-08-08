/** @vitest-environment jsdom */
import { describe, it, expect, vi } from 'vitest'
import { createRoot } from 'react-dom/client'
import { act } from 'react'
import MapEditor from '@editor/components/MapEditor'
import EditorContext from '@editor/context/EditorContext'
import type { Game } from '@editor/data/game'

// React requires this flag for `act`
const reactEnv = globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT?: boolean }
reactEnv.IS_REACT_ACT_ENVIRONMENT = true

describe('MapEditor', () => {
  it('updates map when a tile is placed', () => {
    const game: Game = {
      title: '',
      description: '',
      version: '',
      initialData: { language: '', startPage: '' },
      languages: {},
      pages: {},
      maps: { test: { width: 1, height: 1, map: [['']] } },
      tiles: { a: { value: '' } },
      dialogs: {},
      handlers: [],
      virtualKeys: [],
      virtualInputs: [],
    }
    const setGame = vi.fn()
    const contextValue: React.ContextType<typeof EditorContext> = {
      game,
      setGame,
      selectedPath: [],
      setSelectedPath: () => {},
    }
    const container = document.createElement('div')
    document.body.appendChild(container)
    const root = createRoot(container)

    act(() => {
      root.render(
        <EditorContext.Provider value={contextValue}>
          <MapEditor id="test" />
        </EditorContext.Provider>,
      )
    })

    const tileButton = container.querySelector('[data-tile="a"]') as HTMLButtonElement
    act(() => {
      tileButton.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })

    const cell = container.querySelector('[data-cell="0-0"]') as HTMLDivElement
    act(() => {
      cell.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
      cell.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }))
    })

    expect(setGame).toHaveBeenCalled()
    const updatedGame = setGame.mock.calls[setGame.mock.calls.length - 1][0] as Game
    expect(updatedGame.maps.test.map?.[0][0]).toBe('a')
  })
})
