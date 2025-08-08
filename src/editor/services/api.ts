import { gameSchema } from '@loader/schema/game'
import type { Game } from '@editor/data/game'

export async function saveGame(
  json: string,
  fetchFn: typeof fetch = fetch,
): Promise<string> {
  let data: unknown
  try {
    data = JSON.parse(json)
  } catch {
    return 'Invalid JSON'
  }

  const parsed = gameSchema.safeParse(data)
  if (!parsed.success) {
    const message = parsed.error.issues
      .map((issue) => `${issue.path.join('.') || 'root'}: ${issue.message}`)
      .join('; ')
    return `Validation error: ${message}`
  }

  let response: Response
  try {
    response = await fetchFn('/api/game', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed.data),
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
    pages: Object.fromEntries(
      Object.keys(parsed.pages).map((key) => [key, { title: '', description: '' }]),
    ),
    maps: Object.fromEntries(
      Object.keys(parsed.maps).map((key) => [key, { width: 0, height: 0 }]),
    ),
    tiles: Object.fromEntries(
      Object.entries(parsed.tiles).map(([k, v]) => [k, { value: v }]),
    ),
    dialogs: Object.fromEntries(
      Object.entries(parsed.dialogs).map(([k, v]) => [k, { text: v }]),
    ),
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
