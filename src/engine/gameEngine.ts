import { fatalError } from '@utils/logMessage'
import { MessageBus } from '@utils/messageBus'
import type { ILoader } from 'src/loader/loader'
import { END_TURN_MESSAGE } from './messages'

let gameEngine: GameEngine | null = null
export function getGameEngine(): IGameEngine {
    if (gameEngine === null) {
        fatalError('Game engine is not initialized')
    }
    return gameEngine
}

export interface IGameEngine {
    start(): void
}

export class GameEngine implements IGameEngine {
    private loader: ILoader
    private messageBus: MessageBus

    private endingTurn: boolean = false

    constructor(loader: ILoader) {
        this.loader = loader
        this.messageBus = new MessageBus(() => this.handleOnQueueEmpty())
    }

    public start(): void {
        this.loader.reset()
        this.initStateManager()
    }

    private handleOnQueueEmpty(): void {
        if (this.endingTurn) {
            this.endTurn()
            this.endingTurn = false
            return
        }
        this.endingTurn = true
        this.messageBus.postMessage({
            message: END_TURN_MESSAGE,
            payload: null
        })
    }

    private endTurn(): void {
        // No code here yet
    }

    private initStateManager(): void {
        // create a new state manager instance
    }
}