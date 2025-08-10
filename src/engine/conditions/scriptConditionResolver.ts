import type { IConditionResolver } from './conditionResolver'
import type { Condition, ScriptCondition } from '@loader/data/condition'
import type { IGameEngine } from '@engine/core/gameEngine'

export class ScriptConditionResolver implements IConditionResolver {
    readonly type = 'script' as const

    resolve(engine: IGameEngine, condition: Condition): boolean {
        const { script } = condition as ScriptCondition
        return engine.ScriptRunner.run<boolean>(script, engine.createScriptContext(undefined))
    }
}

