import { logDebug } from '@utils/logMessage'
import type { ILoader } from '@loader/loader'
import type { IMessageBus } from '@utils/messageBus'
import type { IStateManager } from './stateManager'
import type { ContextData } from './context'
import { MAP_SWITCHED_MESSAGE, SWITCH_MAP_MESSAGE } from './messages'
import type { GameMap } from '@loader/data/map'

export interface IMapManager {
    initialize(): void
    cleanup(): void
    switchMap(map: string): Promise<void>
}

export type MapManagerServices = {
    loader: ILoader
    messageBus: IMessageBus
    stateManager: IStateManager<ContextData>
    setIsLoading: () => void
    setIsRunning: () => void
}

export class MapManager implements IMapManager {
    private unregisterEventHandlers: (() => void)[] = []
    private services: MapManagerServices

    constructor(services: MapManagerServices) {
        this.services = services
    }

    public initialize(): void {
        this.unregisterEventHandlers.push(
            this.services.messageBus.registerMessageListener(
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
        const context = this.services.stateManager.state
        if (context.data.location.mapName === map) return

        this.services.setIsLoading()
        if (!context.maps[map]){
            const mapData = await this.services.loader.loadMap(map)
            logDebug('map {0} loaded as {1}', map, mapData)
            context.maps[map] = mapData
        }
        context.data.location.mapName = map
        context.data.location.mapSize.width = context.maps[map].width
        context.data.location.mapSize.height = context.maps[map].height
        await this.loadAdditionalMapData(context.maps[map])
        this.services.messageBus.postMessage({
            message: MAP_SWITCHED_MESSAGE,
            payload: map
        })
        this.services.setIsRunning()
    }

    private async loadAdditionalMapData(mapData: GameMap): Promise<void> {
        const context = this.services.stateManager.state
        for (const tileSetName of mapData.tileSets) {
            if (!context.tileSets[tileSetName]){
                const tileSet = await this.services.loader.loadTileSet(tileSetName)
                logDebug('tile set {0} loaded as {1}', tileSetName, tileSet)
                context.tileSets[tileSetName] = true
                tileSet.tiles.forEach(tile => context.tiles[tile.key] = tile)
            }
        }
    }
}

