import type { ITrackedValue } from '@utility/trackedState'

export const GameEngineState = {
    init: 0,
    loading: 1,
    running: 2
} as const
export type GameEngineState = typeof GameEngineState[keyof typeof GameEngineState]

export interface IGameEngine {
    start(): void
    get State(): ITrackedValue<GameEngineState>
    translate(key: string, language: string): string
}

