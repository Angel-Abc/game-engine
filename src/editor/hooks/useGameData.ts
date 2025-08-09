import { useEffect, useState } from 'react'
import type { GameData } from '../types'

export type Fetcher = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>

export const useGameData = (fetcher: Fetcher = fetch): GameData | null => {
  const [game, setGame] = useState<GameData | null>(null)

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

  return game
}

