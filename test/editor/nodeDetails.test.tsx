/** @vitest-environment jsdom */
import { describe, it, expect, vi } from 'vitest'
import { createRoot } from 'react-dom/client'
import { act } from 'react'
import NodeDetails from '@editor/components/NodeDetails'
import EditorContext from '@editor/context/EditorContext'
import type { Game } from '@editor/data/game'
import type { NodePath } from '@editor/context/EditorContext'

// React requires this flag for `act` in testing environments
const reactEnv = globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT?: boolean }
reactEnv.IS_REACT_ACT_ENVIRONMENT = true

describe('NodeDetails', () => {
  it('renders fields for page node', () => {
    const sampleGame = {
      title: '',
      description: '',
      version: '',
      initialData: { language: 'en', startPage: 'start' },
      languages: { en: ['hello'] },
      pages: { start: { title: 'Start', description: 'Welcome' } },
      maps: {},
      tiles: {},
      dialogs: {},
      handlers: [],
      virtualKeys: [],
      virtualInputs: [],
    } as unknown as Game

    const contextValue = {
      game: sampleGame,
      selectedPath: ['pages', 'start'] as NodePath,
      setSelectedPath: vi.fn(),
      setGame: vi.fn(),
    }

    const container = document.createElement('div')
    document.body.appendChild(container)
    const root = createRoot(container)

    act(() => {
      root.render(
        <EditorContext.Provider value={contextValue}>
          <NodeDetails />
        </EditorContext.Provider>,
      )
    })

    const titleInput = container.querySelector('input[name="title"]') as HTMLInputElement
    const descInput = container.querySelector('input[name="description"]') as HTMLInputElement

    expect(titleInput.value).toBe('Start')
    expect(descInput.value).toBe('Welcome')
  })
})

