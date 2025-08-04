import type { Action } from '@loader/data/action'
import type { IGameEngine } from '@engine/gameEngine'

export interface IActionHandler {
    readonly type: Action['type']
    handle(engine: IGameEngine, action: Action): void
}

