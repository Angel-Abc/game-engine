import { gameSchema } from '@loader/schema/game'
import type { Game } from '@loader/data/game'

export async function saveGame(
  json: string,
  fetchFn: typeof fetch = fetch,
): Promise<string> {
  try {
    JSON.parse(json)
  } catch {
    return 'Invalid JSON'
  }
  let response: Response
  try {
    response = await fetchFn('/api/game', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: json,
    })
  } catch (e) {
    return (e as Error).message
  }
  if (response.ok) {
    return 'Saved'
  }
  return response.text()
}

export async function fetchGame(
  signal?: AbortSignal,
): Promise<{ game: Game; styling: string[] }> {
  const response = await fetch('/api/game', { signal })
  if (!response.ok) {
    throw new Error('Failed to load game data.')
  }
  const data = await response.json()
  const parsed = gameSchema.parse(data)
  const game: Game = {
    title: parsed.title,
    description: parsed.description,
    version: parsed.version,
    initialData: {
      language: parsed['initial-data'].language,
      startPage: parsed['initial-data']['start-page'],
    },
    languages: { ...parsed.languages },
    pages: { ...parsed.pages },
    maps: { ...parsed.maps },
    tiles: { ...parsed.tiles },
    dialogs: { ...parsed.dialogs },
    handlers: [...parsed.handlers],
    virtualKeys: [...parsed['virtual-keys']],
    virtualInputs: [...parsed['virtual-inputs']],
  }
  return { game, styling: parsed.styling }
}

export async function fetchMap(path: string): Promise<unknown> {
  const response = await fetch(`/api/map/${encodeURIComponent(path)}`)
  if (!response.ok) {
    throw new Error('Failed to fetch map')
  }
  return response.json()
}

export async function fetchTiles(path: string): Promise<unknown> {
  const response = await fetch(`/api/map/${encodeURIComponent(path)}`)
  if (!response.ok) {
    throw new Error('Failed to fetch tiles')
  }
  return response.json()
}

