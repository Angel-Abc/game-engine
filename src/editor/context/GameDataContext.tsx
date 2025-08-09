import React, { createContext, useContext, useEffect, useState } from 'react'
import type { GameData } from '../types'

export type Fetcher = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>

interface GameDataContextValue {
  game: GameData | null
  setGame: React.Dispatch<React.SetStateAction<GameData | null>>
  status: string
  saveGame: () => Promise<void>
}

const GameDataContext = createContext<GameDataContextValue | undefined>(undefined)

interface GameDataProviderProps {
  children: React.ReactNode
  fetcher?: Fetcher
}

export const GameDataProvider: React.FC<GameDataProviderProps> = ({
  children,
  fetcher = fetch,
}) => {
  const [game, setGame] = useState<GameData | null>(null)
  const [status, setStatus] = useState('idle')

  useEffect(() => {
    let cancelled = false

    fetcher('/api/game')
      .then((res) => res.json())
      .then((data: GameData) => {
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

  const saveGame = async (): Promise<void> => {
    if (!game) return
    setStatus('saving')
    try {
      await fetcher('/api/game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(game),
      })
      setStatus('saved')
    } catch {
      setStatus('error')
    }
  }

  return (
    <GameDataContext.Provider value={{ game, setGame, status, saveGame }}>
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

