export interface Tile {
  value: string
}

export type Tiles = Record<string, Tile>

export function isTile(value: unknown): value is Tile {
  return typeof value === 'object' && value !== null && 'value' in (value as Record<string, unknown>)
}
