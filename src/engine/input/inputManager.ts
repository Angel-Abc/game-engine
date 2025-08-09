import type { IMessageBus } from '@utils/messageBus'
import { VIRTUAL_INPUT_MESSAGE } from '../messages/messages'
import type { Action, BaseAction } from '@loader/data/action'
import type { Message } from '@utils/types'
import { InputSourceTracker } from './inputSourceTracker'
import { InputMatrixBuilder, type MatrixInputItem } from './inputMatrixBuilder'
import { EventHandlerManager } from '@engine/common/eventHandlerManager'

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
    executeAction: <T extends BaseAction = Action>(action: T, message?: Message, data?: unknown) => void
}

export class InputManager implements IInputManager {
    private services: InputManagerServices
    private eventHandlerManager = new EventHandlerManager()

    constructor(services: InputManagerServices) {
        this.services = services
    }

    public initialize(): void {
        this.eventHandlerManager.addListener(
            this.services.messageBus.registerMessageListener(
                VIRTUAL_INPUT_MESSAGE,
                (message) => this.onInput(message.payload as string)
            )
        )
    }

    public cleanup(): void {
        this.eventHandlerManager.clearListeners()
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
            this.services.executeAction(inputItem.input.action, undefined, inputItem)
        }
    }
}

