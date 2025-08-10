import type { IActionHandler } from './actionHandler'
import type { IGameEngine } from '@engine/core/gameEngine'
import type { Message } from '@utils/types'
import type { EndDialogAction } from '@loader/data/dialog'
import { ADD_LINE_TO_OUTPUT_LOG } from '@engine/messages/messages'
import type { InputItem } from '@engine/input/inputSourceTracker'

export class EndDialogActionHandler implements IActionHandler<EndDialogAction> {
    readonly type = 'end-dialog' as const

    handle(engine: IGameEngine, action: EndDialogAction, _message?: Message, data?: unknown): void {
        void _message
        if (data && typeof data === 'object' && 'input' in data) {
            const inputItem = data as InputItem
            if (inputItem && inputItem.input.description) {
                engine.MessageBus.postMessage({
                    message: ADD_LINE_TO_OUTPUT_LOG,
                    payload: `<p>&gt; ${inputItem.input.description}</p>`,
                })
            }
        }
        if (action.message) {
            engine.MessageBus.postMessage({
                message: ADD_LINE_TO_OUTPUT_LOG,
                payload: engine.TranslationService.translate(action.message)
            })
        }
        const dialogs = engine.StateManager.state.dialogs
        if (dialogs.activeDialog) {
            const state = dialogs.dialogStates[dialogs.activeDialog]
            if (state) state.activeChoices = []
        }
        dialogs.activeDialog = null
        dialogs.isModalDialog = false
    }
}
