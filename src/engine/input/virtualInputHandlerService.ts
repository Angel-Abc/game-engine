import type { IGameEngine } from '../core/gameEngine'
import { VirtualInputHandler, type IVirtualInputHandler, type VirtualInputHandlerServices } from './virtualInputHandler'
import type { IMessageBus } from '@utils/messageBus'
import type { IGameLoader } from '@loader/loader'
import type { IInputLoader } from '@loader/inputsLoader'
import { DocumentKeyboardEventTarget, TestKeyboardEventTarget } from './keyboardEventTarget'

export function createVirtualInputHandler(engine: IGameEngine, messageBus: IMessageBus): IVirtualInputHandler {
    const services: VirtualInputHandlerServices = {
        gameLoader: engine.Loader as IGameLoader,
        inputLoader: engine.Loader as IInputLoader,
        messageBus,
        keyboardEventTarget: typeof document !== 'undefined'
            ? new DocumentKeyboardEventTarget()
            : new TestKeyboardEventTarget()
    }
    return new VirtualInputHandler(services)
}
