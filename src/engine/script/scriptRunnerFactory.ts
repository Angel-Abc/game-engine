import { ScriptRunner, type IScriptRunner } from './scriptRunner'

export function createScriptRunner(): IScriptRunner {
    return new ScriptRunner()
}
