import type { IActionHandler } from './actionHandler'
import type { Action, ScriptAction } from '@loader/data/action'
import type { IGameEngine } from '@engine/core/gameEngine'
import type { Message } from '@utils/types'

export class ScriptActionHandler implements IActionHandler {
    readonly type = 'script' as const

    handle(engine: IGameEngine, action: Action, message?: Message, data?: unknown): void {
        const { script } = action as ScriptAction
        engine.ScriptRunner.run<void>(script, engine.createScriptContext(message, data))
    }
}

