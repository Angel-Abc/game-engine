import type { IMessageBus } from '@utils/messageBus'
import { logDebug } from '@utils/logMessage'
import type { IStateManager } from '../core/stateManager'
import type { ContextData } from '../core/context'
import { CHANGE_POSITION_MESSAGE, POSITION_CHANGED_MESSAGE } from '../messages/messages'
import type { ChangePositionPayload } from '@engine/messages/types'
import type { Action } from '@loader/data/action'
import type { IMapLoaderService } from './mapLoaderService'
import { EventHandlerManager } from '@engine/common/eventHandlerManager'

export interface IMapManager {
    initialize(): void
    cleanup(): void
}

export type MapManagerServices = {
    messageBus: IMessageBus
    stateManager: IStateManager<ContextData>
    executeAction: (action: Action) => void
    mapLoaderService: IMapLoaderService
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
        const tile = gameMap.tiles[tileId]
        this.services.messageBus.postMessage({
            message: POSITION_CHANGED_MESSAGE,
            payload: { x: position.x, y: position.y },
        })
        logDebug('MapManager', 'Position set to x: {0}, y: {1}', position.x, position.y)
        if (tile.onEnter) {
            this.services.executeAction(tile.onEnter)
        }
    }
}

