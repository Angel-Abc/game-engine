import { logDebug } from '@utils/logMessage'
import { loadOnce } from '@utils/loadOnce'
import type { IMapLoader } from '@loader/mapLoader'
import type { ITileLoader } from '@loader/tileLoader'
import type { IMessageBus } from '@utils/messageBus'
import type { IStateManager } from '../core/stateManager'
import type { ContextData } from '../core/context'
import { CHANGE_POSITION_MESSAGE, MAP_SWITCHED_MESSAGE, SWITCH_MAP_MESSAGE } from '../messages/messages'
import type { GameMap } from '@loader/data/map'
import type { SwitchMapPayload } from '@engine/messages/types'

export interface IMapLoaderService {
    initialize(): void
    cleanup(): void
}

export type MapLoaderServiceDependencies = {
    mapLoader: IMapLoader
    tileLoader: ITileLoader
    messageBus: IMessageBus
    stateManager: IStateManager<ContextData>
    setIsLoading: () => void
    setIsRunning: () => void
}

export class MapLoaderService implements IMapLoaderService {
    private unregisterEventHandlers: (() => void)[] = []
    private deps: MapLoaderServiceDependencies

    constructor(deps: MapLoaderServiceDependencies) {
        this.deps = deps
    }

    public initialize(): void {
        this.unregisterEventHandlers.push(
            this.deps.messageBus.registerMessageListener(
                SWITCH_MAP_MESSAGE,
                async (message) => this.switchMap(message.payload as unknown as SwitchMapPayload)
            )
        )
    }

    public cleanup(): void {
        this.unregisterEventHandlers.forEach(unregister => unregister())
        this.unregisterEventHandlers = []
    }

    private async switchMap(switchMap: SwitchMapPayload): Promise<void> {
        const context = this.deps.stateManager.state
        const mapName = switchMap.mapName
        if (context.data.location.mapName === mapName) return

        const mapData = await loadOnce(
            context.maps,
            mapName,
            async () => {
                const loadedMap = await this.deps.mapLoader.loadMap(mapName)
                logDebug('MapLoaderService', 'map {0} loaded as {1}', mapName, loadedMap)
                return loadedMap
            },
            this.deps.setIsLoading,
            this.deps.setIsRunning,
        )

        context.data.location.mapName = mapName
        context.data.location.mapSize.width = mapData.width
        context.data.location.mapSize.height = mapData.height
        await this.loadAdditionalMapData(mapData)
        this.deps.messageBus.postMessage({
            message: MAP_SWITCHED_MESSAGE,
            payload: mapName
        })
        if (switchMap.position) {
            this.deps.messageBus.postMessage({
                message: CHANGE_POSITION_MESSAGE,
                payload: {
                    x: switchMap.position.x,
                    y: switchMap.position.y
                }
            })
        }
    }

    private async loadAdditionalMapData(mapData: GameMap): Promise<void> {
        const context = this.deps.stateManager.state
        for (const tileSetName of mapData.tileSets) {
            await loadOnce(
                context.tileSets as Record<string, boolean>,
                tileSetName,
                async () => {
                    const tileSet = await this.deps.tileLoader.loadTileSet(tileSetName)
                    logDebug('MapLoaderService', 'tile set {0} loaded as {1}', tileSetName, tileSet)
                    tileSet.tiles.forEach(tile => context.tiles[tile.key] = tile)
                    return true
                },
                this.deps.setIsLoading,
                this.deps.setIsRunning,
            )
        }
    }
}
