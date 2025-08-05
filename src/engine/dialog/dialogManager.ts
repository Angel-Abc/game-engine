import { logDebug } from '@utils/logMessage'
import type { IMessageBus } from '@utils/messageBus'
import { DIALOG_STARTED, START_DIALOG } from './messages'

export interface IDialogManager {
    initialize(): void
    cleanup(): void
}

export type DialogManagerServices = {
    messageBus: IMessageBus
}

export class DialogManager implements IDialogManager {
    private unregisterEventHandlers: (() => void)[] = []
    private services: DialogManagerServices

    constructor(services: DialogManagerServices) {
        this.services = services
    }

    public initialize(): void {
        this.unregisterEventHandlers.push(
            this.services.messageBus.registerMessageListener(
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
        this.services.messageBus.postMessage({
            message: DIALOG_STARTED,
        payload: dialogId
        })
    }

}
