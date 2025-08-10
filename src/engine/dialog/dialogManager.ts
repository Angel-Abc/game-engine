import { fatalError, logDebug, logWarning } from '@utils/logMessage'
import type { IMessageBus } from '@utils/messageBus'
import { ADD_LINE_TO_OUTPUT_LOG, DIALOG_SHOW_DIALOG, DIALOG_START_DIALOG } from '../messages/messages'
import type { IStateManager } from '@engine/core/stateManager'
import type { ContextData } from '@engine/core/context'
import type { IDialogLoader } from '@loader/dialogLoader'
import { loadOnce } from '@utils/loadOnce'
import { trueCondition, type Condition } from '@loader/data/condition'
import type { ITranslationService } from './translationService'
import { MessageDrivenManager } from '@engine/common/messageDrivenManager'

export interface IDialogManager {
    initialize(): void
    cleanup(): void
}

export type DialogManagerServices = {
    dialogLoader: IDialogLoader
    messageBus: IMessageBus
    stateManager: IStateManager<ContextData>
    translationService: ITranslationService
    setIsLoading: () => void
    setIsRunning: () => void
    resolveCondition: (condition: Condition | null) => boolean
}

export class DialogManager extends MessageDrivenManager implements IDialogManager {
    private services: DialogManagerServices

    constructor(services: DialogManagerServices) {
        super()
        this.services = services
    }

    public initialize(): void {
        this.registerMessageListener(
            this.services.messageBus,
            DIALOG_START_DIALOG,
            async (message) => this.startDialog(message.payload as string)
        )
        this.registerMessageListener(
            this.services.messageBus,
            DIALOG_SHOW_DIALOG,
            async (message) => this.showDialog(message.payload as string)
        )
    }

    private async startDialog(dialogSetId: string): Promise<void> {
        const context = this.services.stateManager.state
        if (context.dialogs.activeDialog === dialogSetId) return

        const dialogSet = await loadOnce(
            context.dialogSets,
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

        context.dialogs.activeDialog = dialogSetId
        if (!context.dialogs.dialogStates[dialogSetId]) context.dialogs.dialogStates[dialogSetId] = {
            activeChoices: []
        }

        this.services.messageBus.postMessage({
            message: DIALOG_SHOW_DIALOG,
            payload: dialogSet.startWith
        })
    }

    private async showDialog(dialogId: string): Promise<void> {
        const context = this.services.stateManager.state
        if (!context.dialogs.activeDialog) fatalError('No active dialog set for dialog {0}', dialogId)
        const dialogSet = context.dialogSets[context.dialogs.activeDialog]
        if (!dialogSet) fatalError('Dialog set {0} not found', context.dialogs.activeDialog)
        const dialog = dialogSet.dialogs[dialogId]
        if (!dialog) fatalError('Dialog with id {0} not found in dialog set {1}', dialogId, context.dialogs.activeDialog)
        if (dialog.choices.length > 5) logWarning('DialogManager', 'Too many choices in dialog {0}, only the first 5 will be used', dialogId)
        const dialogState = context.dialogs.dialogStates[context.dialogs.activeDialog]
        if (!dialogState) fatalError('Dialog state for dialog set {0} not found', context.dialogs.activeDialog)

        dialogState.activeChoices = []
        for (let index = 0; index < dialog.choices.length && index < 5; index++){
            const choice = dialog.choices[index]
            const count = dialogState.activeChoices.length
            dialogState.activeChoices.push({
                id: choice.id,
                input: {
                    virtualInput: `VI_${count + 1}`,
                    preferredRow: 0,
                    preferredCol: count,
                    label: this.services.translationService.translate(choice.label),                   
                    description: this.services.translationService.translate(choice.label),
                    visible: choice.visible ?? trueCondition,
                    enabled: choice.enabled ?? trueCondition,
                    action: choice.action
                }
            })
        }

        context.dialogs.isModalDialog = !dialog.behavior.canMove
        this.services.messageBus.postMessage({
            message: ADD_LINE_TO_OUTPUT_LOG,
            payload: this.services.translationService.translate(dialog.message)
        })
        logDebug('dialogManager', 'Found dialog {0} = {1}', dialogId, dialog)

    }
}
