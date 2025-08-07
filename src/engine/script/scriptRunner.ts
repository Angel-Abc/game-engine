import { fatalError, logInfo } from '@utils/logMessage'
import type { ContextData } from '../core/context'
import type { Message } from '@utils/types'

export interface IScriptRunner {
    run<T>(script: string, context: ScriptContext): T
}

export type ScriptContext = {
    state: ContextData,
    postMessage: (message: Message) => void,
    triggerMessage?: string,
    triggerPayload?: Message['payload']
}

export class ScriptRunner implements IScriptRunner {
    public run<T>(script: string, context: ScriptContext): T {
        const data = context.state.data
        const scriptFunction = new Function('context', 'data', script)
        try {
            return scriptFunction(context, data) as T
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error)
            logInfo('ScriptRunner', 'Script content: {0}', script)
            logInfo('ScriptRunner', 'Script context: {0}', context)
            fatalError('ScriptRunner', 'Error executing script {0}', message)
        }
    }
}
