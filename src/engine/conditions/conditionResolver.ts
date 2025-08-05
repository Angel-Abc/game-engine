import type { Condition } from '@loader/data/condition'
import type { IGameEngine } from '@engine/core/gameEngine'

export interface IConditionResolver {
    readonly type: Condition['type']
    resolve(engine: IGameEngine, condition: Condition): boolean
}

