export interface ScriptCondition {
    type: 'script'
    script: string
}

export type Condition = ScriptCondition