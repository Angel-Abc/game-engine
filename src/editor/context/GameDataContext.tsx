import React, { createContext, useContext, useEffect, useState } from 'react'
import type { GameData } from '../types'
import { loadGame } from '../api/game'
import type { Fetcher } from '../api/game'

interface GameDataContextValue {
  game: GameData | null
  setGame: React.Dispatch<React.SetStateAction<GameData | null>>
}

const GameDataContext = createContext<GameDataContextValue | undefined>(undefined)

interface GameDataProviderProps {
  children: React.ReactNode
  fetcher?: Fetcher
}

export const GameDataProvider: React.FC<GameDataProviderProps> = ({
  children,
  fetcher,
}) => {
  const [game, setGame] = useState<GameData | null>(null)

  useEffect(() => {
    let cancelled = false

    loadGame(fetcher)
      .then((data) => {
        if (!cancelled) {
          setGame(data)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setGame(null)
        }
      })

    return () => {
      cancelled = true
    }
  }, [fetcher])

  return (
    <GameDataContext.Provider value={{ game, setGame }}>
      {children}
    </GameDataContext.Provider>
  )
}

export const useGameData = (): GameDataContextValue => {
  const context = useContext(GameDataContext)
  if (!context) {
    throw new Error('useGameData must be used within a GameDataProvider')
  }
  return context
}
