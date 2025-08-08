import type { IActionHandler } from './actionHandler'
import type { IGameEngine } from '@engine/core/gameEngine'
import type { Message } from '@utils/types'
import type { GotoDialogAction } from '@loader/data/dialog'
import { DIALOG_SHOW_DIALOG } from '@engine/messages/messages'

export class GotoDialogActionHandler implements IActionHandler<GotoDialogAction> {
    readonly type = 'goto' as const

    handle(engine: IGameEngine, action: GotoDialogAction, _message?: Message): void {
        void _message
        engine.MessageBus.postMessage({ message: DIALOG_SHOW_DIALOG, payload: action.target })
    }
}
