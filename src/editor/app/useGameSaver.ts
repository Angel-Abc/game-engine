import React from 'react'
import type { GameData } from '../types'
import { saveGame as defaultSaveGame } from '../api/game'

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

export interface UseGameSaverOptions {
  saver?: (game: GameData) => Promise<void>
}

export interface GameSaver {
  save: () => Promise<void>
  status: SaveStatus
}

export const useGameSaver = (
  game: GameData | null,
  { saver = defaultSaveGame }: UseGameSaverOptions = {}
): GameSaver => {
  const [status, setStatus] = React.useState<SaveStatus>('idle')

  const save = React.useCallback(async (): Promise<void> => {
    if (!game) return
    setStatus('saving')
    try {
      await saver(game)
      setStatus('saved')
    } catch {
      setStatus('error')
    }
  }, [game, saver])

  return { save, status }
}

