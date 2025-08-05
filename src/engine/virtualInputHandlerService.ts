import type { IGameEngine } from './gameEngine'
import { VirtualInputHandler, type IVirtualInputHandler, type VirtualInputHandlerServices } from './virtualInputHandler'

export function createVirtualInputHandler(engine: IGameEngine): IVirtualInputHandler {
    const services: VirtualInputHandlerServices = {
        loader: engine.Loader,
        messageBus: engine.MessageBus
    }
    return new VirtualInputHandler(services)
}
