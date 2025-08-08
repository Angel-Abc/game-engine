import { gameSchema } from '@loader/schema/game'
import type { Game } from '@editor/data/game'

export async function fetchJson<T>(
  url: string,
  fetchFn: typeof fetch = fetch,
  init?: RequestInit,
  errorMessage = 'Failed to fetch data.',
): Promise<T> {
  const response = await fetchFn(url, init)
  if (!response.ok) {
    throw new Error(errorMessage)
  }
  return response.json() as Promise<T>
}

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
  fetchFn: typeof fetch = fetch,
): Promise<{ game: Game; styling: string[] }> {
  const data = await fetchJson<unknown>(
    '/api/game',
    fetchFn,
    { signal },
    'Failed to load game data.',
  )
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

export async function fetchMap(
  path: string,
  fetchFn: typeof fetch = fetch,
): Promise<unknown> {
  return fetchJson(
    `/api/map/${encodeURIComponent(path)}`,
    fetchFn,
    undefined,
    'Failed to fetch map',
  )
}

export async function fetchTiles(
  path: string,
  fetchFn: typeof fetch = fetch,
): Promise<unknown> {
  return fetchJson(
    `/api/map/${encodeURIComponent(path)}`,
    fetchFn,
    undefined,
    'Failed to fetch tiles',
  )
}
