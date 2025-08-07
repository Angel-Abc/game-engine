import { fatalError } from '@utils/logMessage'
import type { IMessageBus } from '@utils/messageBus'
import { TrackedValue, type ITrackedValue } from '@utils/trackedState'
import { ENGINE_STATE_CHANGED_MESSAGE } from '../messages/messages'

export const GameEngineState = {
    init: 0,
    loading: 1,
    running: 2
} as const
export type GameEngineState = typeof GameEngineState[keyof typeof GameEngineState]

export interface IStateController {
    readonly State: ITrackedValue<GameEngineState>
    setIsLoading(): void
    setIsRunning(): void
}

export class StateController implements IStateController {
    private state: ITrackedValue<GameEngineState>
    private loadCounter = 0
    private messageBus: IMessageBus

    constructor(messageBus: IMessageBus) {
        this.messageBus = messageBus
        this.state = new TrackedValue<GameEngineState>(
            'GameEngine.State',
            GameEngineState.init,
            (newValue, oldValue) => {
                this.messageBus.postMessage({
                    message: ENGINE_STATE_CHANGED_MESSAGE,
                    payload: {
                        oldState: oldValue,
                        newState: newValue
                    }
                })
            }
        )
    }

    public get State(): ITrackedValue<GameEngineState> {
        return this.state
    }

    public setIsLoading(): void {
        this.loadCounter += 1
        if (this.loadCounter === 1) {
            this.state.value = GameEngineState.loading
        }
    }

    public setIsRunning(): void {
        this.loadCounter -= 1
        if (this.loadCounter < 0) {
            fatalError('StateController', 'loadCounter cannot be negative')
        }
        if (this.loadCounter === 0) {
            this.state.value = GameEngineState.running
        }
    }
}

