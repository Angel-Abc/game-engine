import { fatalError, logInfo } from '@utils/logMessage'
import type { ContextData } from './gameEngine'

export interface IScriptRunner {
    run<T>(script: string, context: ScriptContext): T
}

export type ScriptContext = {
    state: ContextData,
    setPosition: (x: number, y: number) => void
}

export class ScriptRunner implements IScriptRunner {
    public run<T>(script: string, context: ScriptContext): T {
        const data = context.state.data
        const scriptFunction = new Function('context', 'data', script)
        try {
            return scriptFunction(context, data) as T
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error)
            logInfo('Script content: {0}', script)
            logInfo('Script context: {0}', context)
            fatalError('Error executing script {0}', message)
        }
    }
}
