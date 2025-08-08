import type { Action, BaseAction } from '@loader/data/action'
import type { IGameEngine } from '@engine/core/gameEngine'
import type { Message } from '@utils/types'


export interface IActionHandler<T extends BaseAction = Action> {
    readonly type: T['type']
    handle(engine: IGameEngine, action: T, message?: Message): void
}

