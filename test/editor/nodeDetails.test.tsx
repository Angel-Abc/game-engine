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

function createGame(): Game {
  return {
    title: '',
    description: '',
    version: '',
    initialData: { language: 'en', startPage: 'start' },
    languages: { en: ['hello'] },
    pages: {},
    maps: {},
    tiles: {},
    dialogs: {},
    handlers: [],
    virtualKeys: [],
    virtualInputs: [],
  } as unknown as Game
}

describe('NodeDetails', () => {
  it('renders fields for page node', () => {
    const sampleGame = createGame()
    sampleGame.pages = { start: { title: 'Start', description: 'Welcome' } }

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

  it('renders and updates tile node', () => {
    const sampleGame = createGame()
    sampleGame.tiles = { grass: '#' }

    const contextValue = {
      game: sampleGame,
      selectedPath: ['tiles', 'grass'] as NodePath,
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

    const valueInput = container.querySelector('input[name="value"]') as HTMLInputElement
    expect(valueInput.value).toBe('#')
  })

  it('renders and updates dialog node', () => {
    const sampleGame = createGame()
    sampleGame.dialogs = { greet: 'Hello' }
    const contextValue = {
      game: sampleGame,
      selectedPath: ['dialogs', 'greet'] as NodePath,
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

    const textArea = container.querySelector('textarea[name="text"]') as HTMLTextAreaElement
    expect(textArea.value).toBe('Hello')
  })

  it('renders and updates handler node', () => {
    const sampleGame = createGame()
    sampleGame.handlers = ['start']
    const contextValue = {
      game: sampleGame,
      selectedPath: ['handlers', 'start'] as NodePath,
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

    const valueInput = container.querySelector('input[name="value"]') as HTMLInputElement
    expect(valueInput.value).toBe('start')
  })

  it('renders and updates virtual key node', () => {
    const sampleGame = createGame()
    sampleGame.virtualKeys = ['A']
    const contextValue = {
      game: sampleGame,
      selectedPath: ['virtualKeys', 'A'] as NodePath,
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

    const valueInput = container.querySelector('input[name="value"]') as HTMLInputElement
    expect(valueInput.value).toBe('A')
  })

  it('renders and updates virtual input node', () => {
    const sampleGame = createGame()
    sampleGame.virtualInputs = ['jump']
    const contextValue = {
      game: sampleGame,
      selectedPath: ['virtualInputs', 'jump'] as NodePath,
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

    const valueInput = container.querySelector('input[name="value"]') as HTMLInputElement
    expect(valueInput.value).toBe('jump')
  })

  it('renders and updates language node', () => {
    const sampleGame = createGame()
    sampleGame.languages = { en: ['hello', 'world'] }
    const contextValue = {
      game: sampleGame,
      selectedPath: ['languages', 'en'] as NodePath,
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

    const textArea = container.querySelector('textarea[name="lines"]') as HTMLTextAreaElement
    expect(textArea.value).toBe('hello\nworld')
  })
})

