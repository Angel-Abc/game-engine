import type { IActionHandler } from './actionHandler'
import type { IGameEngine } from '@engine/core/gameEngine'
import type { Message } from '@utils/types'
import type { GotoDialogAction } from '@loader/data/dialog'
import { ADD_LINE_TO_OUTPUT_LOG, DIALOG_SHOW_DIALOG } from '@engine/messages/messages'
import type { InputItem } from '@engine/input/inputSourceTracker'

export class GotoDialogActionHandler implements IActionHandler<GotoDialogAction> {
    readonly type = 'goto' as const

    handle(engine: IGameEngine, action: GotoDialogAction, _message?: Message, data?: unknown): void {
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
        engine.MessageBus.postMessage({ message: DIALOG_SHOW_DIALOG, payload: action.target })
    }
}
