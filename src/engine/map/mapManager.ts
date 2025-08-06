import { logDebug } from '@utils/logMessage'
import { loadOnce } from '@utils/loadOnce'
import type { ILoader } from '@loader/loader'
import type { IMessageBus } from '@utils/messageBus'
import type { IStateManager } from '../core/stateManager'
import type { ContextData } from '../core/context'
import { CHANGE_POSITION_MESSAGE, MAP_SWITCHED_MESSAGE, POSITION_CHANGED_MESSAGE, SWITCH_MAP_MESSAGE } from '../messages/messages'
import type { GameMap } from '@loader/data/map'
import type { ChangePositionPayload, SwitchMapPayload } from '@engine/messages/types'
import type { Action } from '@loader/data/action'

export interface IMapManager {
    initialize(): void
    cleanup(): void
}

export type MapManagerServices = {
    loader: ILoader
    messageBus: IMessageBus
    stateManager: IStateManager<ContextData>
    setIsLoading: () => void
    setIsRunning: () => void
    executeAction: (action: Action) => void
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
                async (message) => this.switchMap(message.payload as unknown as SwitchMapPayload)
            )
        )
        this.unregisterEventHandlers.push(
            this.services.messageBus.registerMessageListener(
                CHANGE_POSITION_MESSAGE,
                async (message) => this.changePosition(message.payload as unknown as ChangePositionPayload)
            )
        )
    }

    public cleanup(): void {
        this.unregisterEventHandlers.forEach(unregister => unregister())
        this.unregisterEventHandlers = []
    }

    private async switchMap(switchMap: SwitchMapPayload): Promise<void> {
        const context = this.services.stateManager.state
        const mapName = switchMap.mapName
        if (context.data.location.mapName === mapName) return

        const mapData = await loadOnce(
            context.maps,
            mapName,
            async () => {
                const loadedMap = await this.services.loader.loadMap(mapName)
                logDebug('MapManager', 'map {0} loaded as {1}', mapName, loadedMap)
                return loadedMap
            },
            this.services.setIsLoading,
            this.services.setIsRunning,
        )

        context.data.location.mapName = mapName
        context.data.location.mapSize.width = mapData.width
        context.data.location.mapSize.height = mapData.height
        await this.loadAdditionalMapData(mapData)
        this.services.messageBus.postMessage({
            message: MAP_SWITCHED_MESSAGE,
            payload: mapName
        })
        if (switchMap.position) {
            this.services.messageBus.postMessage({
                message: CHANGE_POSITION_MESSAGE,
                payload: {
                    x: switchMap.position.x,
                    y: switchMap.position.y
                }
            })
        }
    }

    private async changePosition(position: { x: number; y: number }): Promise<void> {
        const context = this.services.stateManager.state
        const location = context.data.location
        if (location.position.x === position.x && location.position.y === position.y) return
        location.position = { x: position.x, y: position.y }
        this.services.messageBus.postMessage({
            message: POSITION_CHANGED_MESSAGE,
            payload: { x: position.x, y: position.y },
        })
        logDebug('MapManager', 'Position set to x: {0}, y: {1}', position.x, position.y)
        if (location.mapName === null) return
        const gameMap = context.maps[location.mapName]
        const tileId = gameMap.map[position.y][position.x]
        const tile = gameMap.tiles[tileId]
        if (tile.onEnter) {
            this.services.executeAction(tile.onEnter)
        }
    }


    private async loadAdditionalMapData(mapData: GameMap): Promise<void> {
        const context = this.services.stateManager.state
        for (const tileSetName of mapData.tileSets) {
            await loadOnce(
                context.tileSets as Record<string, boolean>,
                tileSetName,
                async () => {
                    const tileSet = await this.services.loader.loadTileSet(tileSetName)
                    logDebug('MapManager', 'tile set {0} loaded as {1}', tileSetName, tileSet)
                    tileSet.tiles.forEach(tile => context.tiles[tile.key] = tile)
                    return true
                },
                this.services.setIsLoading,
                this.services.setIsRunning,
            )
        }
    }
}

