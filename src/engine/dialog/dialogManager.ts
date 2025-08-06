import { logDebug } from '@utils/logMessage'
import type { IMessageBus } from '@utils/messageBus'
import { DIALOG_SHOW_DIALOG, DIALOG_START_DIALOG } from '../messages/messages'
import type { IStateManager } from '@engine/core/stateManager'
import type { ContextData } from '@engine/core/context'
import type { ILoader } from '@loader/loader'
import { loadOnce } from '@utils/loadOnce'
import type { Condition } from '@loader/data/condition'

export interface IDialogManager {
    initialize(): void
    cleanup(): void
}

export type DialogManagerServices = {
    loader: ILoader
    messageBus: IMessageBus
    stateManager: IStateManager<ContextData>
    setIsLoading: () => void
    setIsRunning: () => void
    resolveCondition: (condition: Condition | null) => boolean
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
                DIALOG_START_DIALOG,
                async (message) => this.startDialog(message.payload as string)
            )
        )
    }

    public cleanup(): void {
        this.unregisterEventHandlers.forEach(unregister => unregister())
        this.unregisterEventHandlers = []
    }

    private async startDialog(dialogId: string): Promise<void> {
        const context = this.services.stateManager.state
        if (context.data.activeDialog === dialogId) return

        const dialogSet = await loadOnce(
            context.dialogs,
            dialogId,
            async () => {
                const loadedDialog = await this.services.loader.loadDialog(dialogId)
                logDebug('DialogManager', 'DialogSet {0} loaded as {1}', dialogId, loadedDialog)
                return loadedDialog
            },
            this.services.setIsLoading,
            this.services.setIsRunning,
        )

        if (!this.services.resolveCondition(dialogSet.startCondition)) return

        context.data.activeDialog = dialogId

        this.services.messageBus.postMessage({
            message: DIALOG_SHOW_DIALOG,
            payload: dialogSet.startWith
        })
    }

}
