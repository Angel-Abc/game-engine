import { logDebug } from '@utils/logMessage'
import type { IGameEngine } from './gameEngine'
import { DIALOG_STARTED, START_DIALOG } from './messages'

export interface IDialogManager {
    cleanup(): void
}

export class DialogManager implements IDialogManager {
    private unregisterEventHandlers: (() => void)[] = []
    private gameEngine: IGameEngine

    constructor(gameEngine: IGameEngine) {
        this.gameEngine = gameEngine
        this.unregisterEventHandlers.push(
            gameEngine.MessageBus.registerMessageListener(
                START_DIALOG,
                async (message) => this.startDialog(message.payload as string)
            )
        )
    }

    public cleanup(): void {
        this.unregisterEventHandlers.forEach(unregister => unregister())
        this.unregisterEventHandlers = []
    }

    private async startDialog(dialogId: string): Promise<void> {
        logDebug('TODO: startDialog called with id = {0}', dialogId)
        this.gameEngine.MessageBus.postMessage({
            message: DIALOG_STARTED,
            payload: dialogId
        })
    }

}