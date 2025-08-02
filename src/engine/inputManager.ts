import { logDebug, logWarning } from '@utils/logMessage'
import type { IGameEngine } from './gameEngine'
import { VIRTUAL_INPUT_MESSAGE } from './messages'

export interface IInputManager {
    cleanup(): void
    update(): void
}

export class InputManager implements IInputManager {
    private unregisterEventHandlers: (() => void)[] = []
    private gameEngine: IGameEngine

    constructor(gameEngine: IGameEngine) {
        this.gameEngine = gameEngine
        this.unregisterEventHandlers.push(gameEngine.MessageBus.registerMessageListener(VIRTUAL_INPUT_MESSAGE, (message) => this.onInput(message.payload as string)))
    }

    public cleanup(): void {
        this.unregisterEventHandlers.forEach(unregister => unregister())
    }

    public update(): void {
        if (!this.checkSources()) {
            this.recalculateInputConditions()
        }
    }

    private recalculateInputConditions(): void {
        logWarning('Method not implemented.')
    }

    private checkSources(): boolean {
        logWarning('Method not implemented.')
        return false
    }

    private onInput(input: string): void {
        logDebug('onInput: {0}', input)
    }

}