import type { IGameEngine } from '../core/gameEngine'
import { VirtualInputHandler, type IVirtualInputHandler, type VirtualInputHandlerServices } from './virtualInputHandler'
import type { IMessageBus } from '@utils/messageBus'
import type { IGameLoader } from '@loader/loader'
import type { IInputLoader } from '@loader/inputsLoader'

export function createVirtualInputHandler(engine: IGameEngine, messageBus: IMessageBus): IVirtualInputHandler {
    const services: VirtualInputHandlerServices = {
        gameLoader: engine.Loader as IGameLoader,
        inputLoader: engine.Loader as IInputLoader,
        messageBus
    }
    return new VirtualInputHandler(services)
}
