import { VirtualInputHandler, type IVirtualInputHandler, type VirtualInputHandlerServices } from './virtualInputHandler'
import type { IMessageBus } from '@utils/messageBus'
import type { IGameLoader } from '@loader/gameLoader'
import type { IInputLoader } from '@loader/inputsLoader'
import { DocumentKeyboardEventTarget, TestKeyboardEventTarget } from './keyboardEventTarget'

export function createVirtualInputHandler(
    gameLoader: IGameLoader,
    inputLoader: IInputLoader,
    messageBus: IMessageBus
): IVirtualInputHandler {
    const services: VirtualInputHandlerServices = {
        gameLoader,
        inputLoader,
        messageBus,
        keyboardEventTarget: typeof document !== 'undefined'
            ? new DocumentKeyboardEventTarget()
            : new TestKeyboardEventTarget()
    }
    return new VirtualInputHandler(services)
}
