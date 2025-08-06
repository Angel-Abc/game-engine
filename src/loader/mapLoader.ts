import { loadJsonResource } from '@utils/loadJsonResource'
import type { GameMap as MapData } from './data/map'
import { squaresMapSchema, type SquaresMap as SchemaSquaresMap } from './schema/map'
import { mapGameMap } from './mappers/map'

export interface IMapLoader {
    loadMap(id: string): Promise<MapData>
}

interface Context {
    basePath: string
    path: string
}

export async function mapLoader(context: Context): Promise<MapData> {
    const schemaData = await loadJsonResource<SchemaSquaresMap>(`${context.basePath}/${context.path}`, squaresMapSchema)
    return mapGameMap(schemaData)
}

