import type { IActionHandler } from './actionHandler'
import type { Action, PostMessageAction } from '@loader/data/action'
import type { IGameEngine } from '@engine/core/gameEngine'
import type { Message } from '@utils/types'

export class PostMessageActionHandler implements IActionHandler {
    readonly type = 'post-message' as const

    handle(engine: IGameEngine, action: Action, _message?: Message, _data?: unknown): void {
        void _message
        void _data
        const { message, payload } = action as PostMessageAction
        engine.MessageBus.postMessage({ message, payload })
    }
}

