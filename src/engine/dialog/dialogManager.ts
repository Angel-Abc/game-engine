import { fatalError, logDebug } from '@utils/logMessage'
import type { IMessageBus } from '@utils/messageBus'
import { DIALOG_SHOW_DIALOG, DIALOG_START_DIALOG } from '../messages/messages'
import type { IStateManager } from '@engine/core/stateManager'
import type { ContextData } from '@engine/core/context'
import type { IDialogLoader } from '@loader/dialogLoader'
import { loadOnce } from '@utils/loadOnce'
import type { Condition } from '@loader/data/condition'

export interface IDialogManager {
    initialize(): void
    cleanup(): void
}

export type DialogManagerServices = {
    dialogLoader: IDialogLoader
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
        this.unregisterEventHandlers.push(
            this.services.messageBus.registerMessageListener(
                DIALOG_SHOW_DIALOG,
                async (message) => this.showDialog(message.payload as string)
            )
        )
    }

    public cleanup(): void {
        this.unregisterEventHandlers.forEach(unregister => unregister())
        this.unregisterEventHandlers = []
    }

    private async startDialog(dialogSetId: string): Promise<void> {
        const context = this.services.stateManager.state
        if (context.data.activeDialog === dialogSetId) return

        const dialogSet = await loadOnce(
            context.dialogs,
            dialogSetId,
            async () => {
                const loadedDialog = await this.services.dialogLoader.loadDialog(dialogSetId)
                logDebug('DialogManager', 'DialogSet {0} loaded as {1}', dialogSetId, loadedDialog)
                return loadedDialog
            },
            this.services.setIsLoading,
            this.services.setIsRunning,
        )

        if (!this.services.resolveCondition(dialogSet.startCondition)) return

        context.data.activeDialog = dialogSetId

        this.services.messageBus.postMessage({
            message: DIALOG_SHOW_DIALOG,
            payload: dialogSet.startWith
        })
    }

    private async showDialog(dialogId: string): Promise<void> {
        const context = this.services.stateManager.state
        if (!context.data.activeDialog) fatalError('No active dialog set for dialog {0}', dialogId)
        const dialogSet = context.dialogs[context.data.activeDialog]
        if (!dialogSet) fatalError('Dialog set {0} not found', context.data.activeDialog)
        const dialog = dialogSet.dialogs[dialogId]
        if (!dialog) fatalError('Dialog with id {0} not found in dialog set {1}', dialogId, context.data.activeDialog)

        logDebug('dialogManager', 'Found dialog {0} = {1}', dialogId, dialog)
    }
}
