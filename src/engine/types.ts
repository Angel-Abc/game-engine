import type { PageModule } from '@data/game/page'
import type { ITrackedValue } from '@utility/trackedState'
import type { Message } from '@utility/types'

export const GameEngineState = {
    init: 0,
    loading: 1,
    running: 2
} as const
export type GameEngineState = typeof GameEngineState[keyof typeof GameEngineState]

export interface IGameEngine {
    start(): void
    cleanup(): void
    get State(): ITrackedValue<GameEngineState>
    translate(key: string, language: string): string
    get ActivePage(): PageModule | undefined
    postMessage(message: Message): void
}

