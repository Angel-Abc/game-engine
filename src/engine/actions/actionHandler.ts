import type { Action } from '@loader/data/action'
import type { IGameEngine } from '@engine/core/gameEngine'
import type { Message } from '@utils/types'

export interface IActionHandler {
    readonly type: Action['type']
    handle(engine: IGameEngine, action: Action, message?: Message): void
}

