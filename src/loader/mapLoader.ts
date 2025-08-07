import { loadJsonResource } from '@utils/loadJsonResource'
import type { GameMap as MapData } from './data/map'
import { squaresMapSchema, type SquaresMap as SchemaSquaresMap } from './schema/map'
import { mapGameMap } from './mappers/map'
import { fatalError } from '@utils/logMessage'
import type { IGameLoader } from './loader'

export interface IMapLoader {
    loadMap(id: string): Promise<MapData>
    reset(): void
}

export class MapLoader implements IMapLoader {
    private basePath: string
    private gameLoader: IGameLoader
    private cache: Map<string, MapData> = new Map()

    constructor(basePath: string, gameLoader: IGameLoader) {
        this.basePath = basePath
        this.gameLoader = gameLoader
    }

    public reset(): void {
        this.cache.clear()
    }

    public async loadMap(id: string): Promise<MapData> {
        if (this.cache.has(id)) return this.cache.get(id)!
        const path = this.gameLoader.Game.maps[id]
            ?? fatalError('MapLoader', 'Unknown map: {0}', id)
        const schemaData = await loadJsonResource<SchemaSquaresMap>(`${this.basePath}/${path}`, squaresMapSchema)
        const mapData = mapGameMap(schemaData)
        this.cache.set(id, mapData)
        return mapData
    }
}
