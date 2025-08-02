import { loadJsonResource } from '@utils/loadJsonResource'
import type { TileSet as TileSetData } from './data/tile'
import { tileSetSchema, type TileSet as SchemaTileSet } from './schema/tile'
import { mapTile } from './mappers/tile'

function getDirectory(path: string): string {
    const idx = path.lastIndexOf('/')
    if (idx === -1) return ''
    return path.substring(0, idx)
}

interface Context {
    basePath: string
    path: string
}

export async function tileLoader(context: Context): Promise<TileSetData> {
    const schemaData = await loadJsonResource<SchemaTileSet>(`${context.basePath}/${context.path}`, tileSetSchema)
    const dir = getDirectory(context.path)
    const prefix = dir ? `${context.basePath}/${dir}` : context.basePath
    return {
        id: schemaData.id,
        tiles: schemaData.tiles.map(t => mapTile(prefix, t))
    }
}
