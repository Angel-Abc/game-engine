import type { IGameEngine } from './gameEngine'
import { VIRTUAL_INPUT_MESSAGE } from './messages'
import type { Input } from '@loader/data/inputs'

export interface IInputManager {
    cleanup(): void
    update(): void
}

type InputItem = {
    input: Input
    enabled: boolean
    visible: boolean
}

export class InputManager implements IInputManager {
    private unregisterEventHandlers: (() => void)[] = []
    private gameEngine: IGameEngine
    private currentPage: string | null = null
    private inputs: Map<string, InputItem> = new Map()
    
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
        this.inputs.forEach((inputItem) => {
            const input = inputItem.input
            inputItem.enabled = this.gameEngine.resolveCondition(input.enabled ?? null)
            inputItem.visible = this.gameEngine.resolveCondition(input.visible ?? null)
        })
    }

    private checkSources(): boolean {
        if (this.currentPage === this.gameEngine.StateManager.state.data.activePage) {
            return false
        }
        this.inputs.clear()
        this.currentPage = this.gameEngine.StateManager.state.data.activePage
        if (this.currentPage === null) {
            return false
        }
        const page = this.gameEngine.StateManager.state.pages[this.currentPage]
        page.inputs.forEach(input => {
            this.inputs.set(input.virtualInput, {
                input,
                enabled: this.gameEngine.resolveCondition(input.enabled ?? null),
                visible: this.gameEngine.resolveCondition(input.visible ?? null)
            })
        })
        return false
    }

    private onInput(input: string): void {
        const inputItem = this.inputs.get(input)
        if (inputItem && inputItem.enabled) {
            this.gameEngine.executeAction(inputItem.input.action ?? null)
        }
    }

}