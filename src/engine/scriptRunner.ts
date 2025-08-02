import { fatalError, logInfo } from '@utils/logMessage'
import type { ContextData } from './gameEngine'

export interface IScriptRunner {
    run<T>(script: string, context: ScriptContext): T
}

export type ScriptContext = {
    state: ContextData
}

export class ScriptRunner implements IScriptRunner {
    public run<T>(script: string, context: ScriptContext): T {
        const data = context.state.data
        // eslint-disable-next-line @typescript-eslint/no-implied-eval
        const scriptFunction = new Function('context', 'data', script)
        try {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            return scriptFunction(context, data) as T
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error)
            logInfo('Script content: {0}', script)
            logInfo('Script context: {0}', context)
            fatalError('Error executing script {0}', message)
        }
    }
}
