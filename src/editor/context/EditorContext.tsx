import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { Game } from '@editor/data/game'
import { fetchGame } from '@editor/services/api'

export type NodePath = string[]

interface EditorContextValue {
  game: Game | null
  selectedPath: NodePath
  setSelectedPath: (path: NodePath) => void
}

const EditorContext = createContext<EditorContextValue | undefined>(undefined)

interface EditorProviderProps {
  children: ReactNode
  fetchGameFn?: typeof fetchGame
}

export const EditorProvider: React.FC<EditorProviderProps> = ({
  children,
  fetchGameFn = fetchGame,
}) => {
  const [game, setGame] = useState<Game | null>(null)
  const [selectedPath, setSelectedPath] = useState<NodePath>([])

  useEffect(() => {
    const controller = new AbortController()
    fetchGameFn(controller.signal)
      .then((data) => setGame(data.game))
      .catch(() => setGame(null))
    return () => controller.abort()
  }, [fetchGameFn])

  return (
    <EditorContext.Provider value={{ game, selectedPath, setSelectedPath }}>
      {children}
    </EditorContext.Provider>
  )
}

export function useEditorContext(): EditorContextValue {
  const context = useContext(EditorContext)
  if (!context) {
    throw new Error('useEditorContext must be used within an EditorProvider')
  }
  return context
}

export default EditorContext
