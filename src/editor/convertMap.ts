import type { GameMap as DataGameMap, MapTile as DataMapTile } from '@loader/data/map'
import type { SquaresMap as SchemaSquaresMap } from '@loader/schema/map'
import { mapMapTile } from '@loader/mappers/map'

export function toSchemaMap(map: DataGameMap): SchemaSquaresMap {
  return {
    key: map.key,
    type: 'squares-map',
    width: map.width,
    height: map.height,
    tileSets: map.tileSets,
    tiles: Object.values(map.tiles),
    map: map.map.map((row) => row.join(',')),
  }
}

export function fromAnyMap(map: SchemaSquaresMap | DataGameMap): DataGameMap {
  if (Array.isArray((map as DataGameMap).map?.[0])) {
    const data = map as DataGameMap
    if (Array.isArray((data as unknown as { tiles: unknown }).tiles)) {
      const tilesArray = (data as unknown as { tiles: DataMapTile[] }).tiles
      const tilesRecord: Record<string, DataMapTile> = {}
      tilesArray.forEach((t) => {
        tilesRecord[t.key] = t
      })
      return { ...data, tiles: tilesRecord }
    }
    return data
  }

  const schema = map as SchemaSquaresMap
  const tilesRecord: Record<string, DataMapTile> = {}
  schema.tiles.forEach((t) => {
    tilesRecord[t.key] = mapMapTile(t)
  })
  return {
    key: schema.key,
    type: 'squares-map',
    width: schema.width,
    height: schema.height,
    tileSets: schema.tileSets,
    tiles: tilesRecord,
    map: schema.map.map((row) => row.split(',')),
  }
}
