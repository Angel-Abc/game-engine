import { logDebug } from '@utils/logMessage'
import type { IGameEngine } from './gameEngine'
import { MAP_SWITCHED_MESSAGE, SWITCH_MAP_MESSAGE } from './messages'
import type { GameMap } from '@loader/data/map'

export interface IMapManager {
    cleanup(): void
    switchMap(map: string): Promise<void>
}

export class MapManager implements IMapManager {
    private unregisterEventHandlers: (() => void)[] = []
    private gameEngine: IGameEngine

    constructor(gameEngine: IGameEngine) {
        this.gameEngine = gameEngine
        this.unregisterEventHandlers.push(
            gameEngine.MessageBus.registerMessageListener(
                SWITCH_MAP_MESSAGE,
                async (message) => this.switchMap(message.payload as string)
            )
        )
    }

    public cleanup(): void {
        this.unregisterEventHandlers.forEach(unregister => unregister())
        this.unregisterEventHandlers = []
    }

    public async switchMap(map: string): Promise<void> {
        const context = this.gameEngine.StateManager.state
        if (context.data.location.mapName === map) return

        this.gameEngine.setIsLoading()
        if (!context.maps[map]){
            const mapData = await this.gameEngine.Loader.loadMap(map)
            logDebug('map {0} loaded as {1}', map, mapData)
            context.maps[map] = mapData
        }
        context.data.location.mapName = map
        context.data.location.mapSize.width = context.maps[map].width
        context.data.location.mapSize.height = context.maps[map].height
        await this.loadAdditionalMapData(context.maps[map])
        this.gameEngine.MessageBus.postMessage({
            message: MAP_SWITCHED_MESSAGE,
            payload: map
        })
        this.gameEngine.setIsRunning()
    }

    private async loadAdditionalMapData(mapData: GameMap): Promise<void> {
        const context = this.gameEngine.StateManager.state
        for (const tileSetName of mapData.tileSets) {
            if (!context.tileSets[tileSetName]){
                const tileSet = await this.gameEngine.Loader.loadTileSet(tileSetName)
                logDebug('tile set {0} loaded as {1}', tileSetName, tileSet)
                context.tileSets[tileSetName] = true
                tileSet.tiles.forEach(tile => context.tiles[tile.key] = tile)
            }
        }
    }
}

