import { loadJsonResource } from '@utils/loadJsonResource'
import type { TileSet as TileSetData } from './data/tile'
import { tileSetSchema, type TileSet as SchemaTileSet } from './schema/tile'
import { mapTile } from './mappers/tile'
import { fatalError } from '@utils/logMessage'
import type { IGameLoader } from './gameLoader'

export interface ITileLoader {
    loadTileSet(id: string): Promise<TileSetData>
    reset(): void
}

export class TileLoader implements ITileLoader {
    private basePath: string
    private gameLoader: IGameLoader
    private cache: Map<string, TileSetData> = new Map()

    constructor(basePath: string, gameLoader: IGameLoader) {
        this.basePath = basePath
        this.gameLoader = gameLoader
    }

    public reset(): void {
        this.cache.clear()
    }

    private getDirectory(path: string): string {
        const idx = path.lastIndexOf('/')
        if (idx === -1) return ''
        return path.substring(0, idx)
    }

    public async loadTileSet(id: string): Promise<TileSetData> {
        if (this.cache.has(id)) return this.cache.get(id)!
        const path = this.gameLoader.Game.tiles[id] ?? fatalError('TileLoader', 'Unknown tile set: {0}', id)
        const schemaData = await loadJsonResource<SchemaTileSet>(`${this.basePath}/${path}`, tileSetSchema)
        const dir = this.getDirectory(path)
        const prefix = dir ? `${this.basePath}/${dir}` : this.basePath
        const tileSet: TileSetData = {
            id: schemaData.id,
            tiles: schemaData.tiles.map(t => mapTile(prefix, t))
        }
        this.cache.set(id, tileSet)
        return tileSet
    }
}

