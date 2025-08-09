import type { Tile } from '@loader/data/tile'

/**
 * Resolves relative tile image paths to absolute paths inside the game data directory.
 *
 * @param tilePath Path to the tile set JSON relative to the game folder
 * @param tiles Array of tiles loaded from the JSON file
 * @returns Record of tiles with image paths resolved
 */
export function resolveTileSet(tilePath: string, tiles: Tile[]): Record<string, Tile> {
  const idx = tilePath.lastIndexOf('/')
  const dir = idx >= 0 ? tilePath.substring(0, idx) : ''
  const prefix = `/data/${dir}`
  const result: Record<string, Tile> = {}
  tiles.forEach((t) => {
    result[t.key] = {
      ...t,
      image: t.image ? `${prefix}/${t.image}` : undefined,
    }
  })
  return result
}
