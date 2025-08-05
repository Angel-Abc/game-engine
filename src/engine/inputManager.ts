import type { IMessageBus } from '@utils/messageBus'
import { VIRTUAL_INPUT_MESSAGE } from './messages'
import type { Action } from '@loader/data/action'
import { InputSourceTracker } from './inputSourceTracker'
import { InputMatrixBuilder, type MatrixInputItem } from './inputMatrixBuilder'

export type { MatrixInputItem } from './inputMatrixBuilder'
export { nullMatrixInputItem } from './inputMatrixBuilder'

export interface IInputManager {
    initialize(): void
    cleanup(): void
    update(): void
    getInputMatrix(width: number, height: number): MatrixInputItem[][]
}

export type InputManagerServices = {
    messageBus: IMessageBus
    inputSourceTracker: InputSourceTracker
    inputMatrixBuilder: InputMatrixBuilder
    executeAction: (action: Action) => void
}

export class InputManager implements IInputManager {
    private unregisterEventHandlers: (() => void)[] = []
    private services: InputManagerServices

    constructor(services: InputManagerServices) {
        this.services = services
    }

    public initialize(): void {
        this.unregisterEventHandlers.push(
            this.services.messageBus.registerMessageListener(
                VIRTUAL_INPUT_MESSAGE,
                (message) => this.onInput(message.payload as string)
            )
        )
    }

    public cleanup(): void {
        this.unregisterEventHandlers.forEach(unregister => unregister())
        this.unregisterEventHandlers = []
    }

    public update(): void {
        this.services.inputSourceTracker.update()
    }

    public getInputMatrix(width: number, height: number): MatrixInputItem[][] {
        const inputs = this.services.inputSourceTracker.getVisibleInputs()
        return this.services.inputMatrixBuilder.build(width, height, inputs)
    }

    private onInput(input: string): void {
        const inputItem = this.services.inputSourceTracker.getInput(input)
        if (inputItem && inputItem.enabled && inputItem.input.action) {
            this.services.executeAction(inputItem.input.action)
        }
    }
}

