import { END_TURN_MESSAGE, FINALIZE_END_TURN_MESSAGE } from '../messages/messages'
import type { IMessageBus } from '@utils/messageBus'
import type { IStateManager } from './stateManager'
import type { ContextData } from './context'
import type { IInputManager } from '../input/inputManager'

export interface ITurnScheduler {
    onQueueEmpty(): void
}

export const EndingTurnState = {
    NOT_STARTED: 0,
    STARTED: 1,
    FINALIZING: 2
} as const
export type EndingTurnState = typeof EndingTurnState[keyof typeof EndingTurnState]

export class TurnScheduler implements ITurnScheduler {
    private endingTurn: EndingTurnState = EndingTurnState.NOT_STARTED
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
        switch (this.endingTurn) {
            case EndingTurnState.NOT_STARTED:
                this.endingTurn = EndingTurnState.STARTED
                this.messageBus.postMessage({
                    message: END_TURN_MESSAGE,
                    payload: null
                })
                break
            case EndingTurnState.STARTED:
                this.stateManager.commitTurn()
                this.inputManager.update()
                this.endingTurn = EndingTurnState.FINALIZING
                this.messageBus.postMessage({
                    message: FINALIZE_END_TURN_MESSAGE,
                    payload: null
                })
                return
                break
            case EndingTurnState.FINALIZING:
                this.endingTurn = EndingTurnState.NOT_STARTED
                break
        }

    }
}

