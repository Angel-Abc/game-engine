import type { GameData } from '../types'
import type { Game as LoaderGame } from '../../loader/schema/game'

export type Fetcher = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>

export const loadGame = async (fetcher: Fetcher = fetch): Promise<GameData> => {
  const response = await fetcher('/api/game')
  if (!response.ok) {
    throw new Error('Failed to load game')
  }
  return await response.json()
}

export const saveGame = async (
  game: GameData,
  fetcher: Fetcher = fetch
): Promise<void> => {
  const serialized: LoaderGame = {
    ...(game as Omit<LoaderGame, 'pages'>),
    pages: Object.fromEntries(
      Object.entries(game.pages ?? {}).map(([key, value]) => [
        key,
        typeof value === 'string' ? value : value.fileName ?? '',
      ])
    ),
  }

  const response = await fetcher('/api/game', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(serialized),
  })
  if (!response.ok) {
    throw new Error('Failed to save game')
  }
}
