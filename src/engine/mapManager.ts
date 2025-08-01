import { logDebug } from '@utils/logMessage'
import type { IGameEngine } from './gameEngine'
import { SWITCH_MAP_MESSAGE } from './messages'

export interface IMapManager {
    cleanup(): void
    switchMap(map: string): Promise<void>
}

export class MapManager implements IMapManager {
    private gameEngine: IGameEngine
    private unregisterEventHandlers: (() => void)[] = []

    constructor(gameEngine: IGameEngine){
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
    }

    public async switchMap(map: string): Promise<void> {
        logDebug('TODO: {0}', map)
    }
}

