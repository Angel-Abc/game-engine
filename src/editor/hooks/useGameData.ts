import { useEffect, useState } from 'react'
import type { Game } from '@loader/data/game'
import { fetchGame as defaultFetchGame, saveGame as defaultSaveGame } from '../services/api'

export interface UseGameDataResult {
  game: Game | null
  setGame: React.Dispatch<React.SetStateAction<Game | null>>
  styling: string[]
  setStyling: React.Dispatch<React.SetStateAction<string[]>>
  statusMessage: string
  setStatusMessage: React.Dispatch<React.SetStateAction<string>>
  loadError: string
  saving: boolean
  save: () => Promise<void>
}

export function useGameData(
  fetchGame: typeof defaultFetchGame = defaultFetchGame,
  saveGame: typeof defaultSaveGame = defaultSaveGame,
): UseGameDataResult {
  const [game, setGame] = useState<Game | null>(null)
  const [styling, setStyling] = useState<string[]>([])
  const [statusMessage, setStatusMessage] = useState('')
  const [saving, setSaving] = useState(false)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    const load = async () => {
      try {
        const { game: loadedGame, styling: styles } = await fetchGame(controller.signal)
        setGame(loadedGame)
        setStyling(styles)
      } catch (err) {
        if ((err as Error).name === 'AbortError') return
        setLoadError('Failed to load game data.')
        setGame({
          title: '',
          description: '',
          version: '',
          initialData: { language: '', startPage: '' },
          languages: {},
          pages: {},
          maps: {},
          dialogs: {},
          tiles: {},
          handlers: [],
          virtualKeys: [],
          virtualInputs: [],
        })
        setStyling([])
      }
    }

    load()
    return () => controller.abort()
  }, [fetchGame])

  const save = async () => {
    if (!game) return
    const obj = {
      title: game.title,
      description: game.description,
      version: game.version,
      'initial-data': {
        language: game.initialData.language,
        'start-page': game.initialData.startPage,
      },
      languages: game.languages,
      pages: game.pages,
      maps: game.maps,
      tiles: game.tiles,
      dialogs: game.dialogs,
      styling,
      handlers: game.handlers,
      'virtual-keys': game.virtualKeys,
      'virtual-inputs': game.virtualInputs,
    }
    const json = JSON.stringify(obj, null, 2)
    setSaving(true)
    const message = await saveGame(json)
    setStatusMessage(message)
    setSaving(false)
  }

  return {
    game,
    setGame,
    styling,
    setStyling,
    statusMessage,
    setStatusMessage,
    loadError,
    saving,
    save,
  }
}
