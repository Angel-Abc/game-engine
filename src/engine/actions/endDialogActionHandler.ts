import type { IActionHandler } from './actionHandler'
import type { IGameEngine } from '@engine/core/gameEngine'
import type { Message } from '@utils/types'
import type { EndDialogAction } from '@loader/data/dialog'

export class EndDialogActionHandler implements IActionHandler<EndDialogAction> {
    readonly type = 'end-dialog' as const

    handle(engine: IGameEngine, _action: EndDialogAction, _message?: Message): void {
        void _action
        void _message
        const dialogs = engine.StateManager.state.dialogs
        if (dialogs.activeDialog) {
            const state = dialogs.dialogStates[dialogs.activeDialog]
            if (state) state.activeChoices = []
        }
        dialogs.activeDialog = null
        dialogs.isModalDialog = false
    }
}
