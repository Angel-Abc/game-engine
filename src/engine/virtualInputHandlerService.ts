import type { IGameEngine } from './gameEngine'
import { VirtualInputHandler, type IVirtualInputHandler, type VirtualInputHandlerServices } from './virtualInputHandler'
import type { IMessageBus } from '@utils/messageBus'

export function createVirtualInputHandler(engine: IGameEngine, messageBus: IMessageBus): IVirtualInputHandler {
    const services: VirtualInputHandlerServices = {
        loader: engine.Loader,
        messageBus
    }
    return new VirtualInputHandler(services)
}
