import type { IMessageBus } from '@utils/messageBus'
import { logDebug } from '@utils/logMessage'
import type { IStateManager } from '../core/stateManager'
import type { ContextData } from '../core/context'
import { CHANGE_POSITION_MESSAGE, POSITION_CHANGED_MESSAGE } from '../messages/messages'
import type { ChangePositionPayload } from '@engine/messages/types'
import type { Action } from '@loader/data/action'
import type { Message } from '@utils/types'
import type { IMapLoaderService } from './mapLoaderService'
import { EventHandlerManager } from '@engine/common/eventHandlerManager'
import type { ITranslationService } from '@engine/dialog/translationService'

export interface IMapManager {
    initialize(): void
    cleanup(): void
}

export type MapManagerServices = {
    messageBus: IMessageBus
    stateManager: IStateManager<ContextData>
    executeAction: (action: Action, message?: Message, data?: unknown) => void
    mapLoaderService: IMapLoaderService
    translationService: ITranslationService
}

export class MapManager implements IMapManager {
    private eventHandlerManager = new EventHandlerManager()
    private services: MapManagerServices

    constructor(services: MapManagerServices) {
        this.services = services
    }

    public initialize(): void {
        this.services.mapLoaderService.initialize()
        this.eventHandlerManager.addListener(
            this.services.messageBus.registerMessageListener(
                CHANGE_POSITION_MESSAGE,
                async (message) => this.changePosition(message.payload as unknown as ChangePositionPayload)
            )
        )
    }

    public cleanup(): void {
        this.services.mapLoaderService.cleanup()
        this.eventHandlerManager.clearListeners()
    }

    private async changePosition(position: { x: number; y: number }): Promise<void> {
        const context = this.services.stateManager.state
        const location = context.data.location
        if (location.position.x === position.x && location.position.y === position.y) return
        location.position = { x: position.x, y: position.y }
        if (location.mapName === null) return
        const gameMap = context.maps[location.mapName]
        const tileId = gameMap.map[position.y][position.x]
        const mapTile = gameMap.tiles[tileId]
        const tile = context.tiles[mapTile.tile]
        this.services.messageBus.postMessage({
            message: POSITION_CHANGED_MESSAGE,
            payload: { 
                x: position.x, 
                y: position.y,
                tile: this.services.translationService.translate(tile.description)
            },
        })
        logDebug('MapManager', 'Position set to x: {0}, y: {1}', position.x, position.y)
        if (mapTile.onEnter) {
            this.services.executeAction(mapTile.onEnter, undefined)
        }
    }
}

