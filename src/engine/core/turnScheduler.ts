import { END_TURN_MESSAGE } from '../messages/messages'
import type { IMessageBus } from '@utils/messageBus'
import type { IStateManager } from './stateManager'
import type { ContextData } from './context'
import type { IInputManager } from '../input/inputManager'

export interface ITurnScheduler {
    onQueueEmpty(): void
}

export class TurnScheduler implements ITurnScheduler {
    private endingTurn = false
    private stateManager: IStateManager<ContextData>
    private inputManager: IInputManager
    private messageBus: IMessageBus

    constructor(
        stateManager: IStateManager<ContextData>,
        inputManager: IInputManager,
        messageBus: IMessageBus
    ) {
        this.stateManager = stateManager
        this.inputManager = inputManager
        this.messageBus = messageBus
    }

    onQueueEmpty(): void {
        if (this.endingTurn) {
            this.stateManager.commitTurn()
            this.inputManager.update()
            this.endingTurn = false
            return
        }
        this.endingTurn = true
        this.messageBus.postMessage({
            message: END_TURN_MESSAGE,
            payload: null
        })
    }
}

