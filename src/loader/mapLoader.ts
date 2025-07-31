import { loadJsonResource } from '@utils/loadJsonResource'
import type { GameMap as MapData, MapTile as MapTileData } from './data/map'
import { squaresMapSchema, type SquaresMap as SchemaSquaresMap, type MapTile as SchemaMapTile } from './schema/map'

interface Context {
    basePath: string
    path: string
}

export async function mapLoader(context: Context): Promise<MapData> {
    const schemaData = await loadJsonResource<SchemaSquaresMap>(`${context.basePath}/${context.path}`, squaresMapSchema)
    return getMap(schemaData)
}

function getMap(map: SchemaSquaresMap): MapData {
    return {
        key: map.key,
        type: 'squares-map',
        width: map.width,
        height: map.height,
        tileSets: map.tileSets,
        tiles: map.tiles.map(getMapTile),
        map: map.map.map(row => row.split(',')),
    }
}

function getMapTile(tile: SchemaMapTile): MapTileData {
    return {
        key: tile.key,
        tile: tile.tile,
    }
}
