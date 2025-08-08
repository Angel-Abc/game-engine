import type { Action } from '@loader/data/action'
import type { IGameEngine } from '@engine/core/gameEngine'
import type { Message } from '@utils/types'

export type BaseAction = { type: string }

export interface IActionHandler<T extends BaseAction = Action> {
    readonly type: T['type']
    handle(engine: IGameEngine, action: T, message?: Message): void
}

