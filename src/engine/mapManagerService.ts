import type { IGameEngine } from './gameEngine'
import { MapManager, type IMapManager, type MapManagerServices } from './mapManager'
import type { IStateManager } from './stateManager'
import type { ContextData } from './context'
import type { IMessageBus } from '@utils/messageBus'

export function createMapManager(
    engine: IGameEngine,
    messageBus: IMessageBus,
    stateManager: IStateManager<ContextData>
): IMapManager {
    const services: MapManagerServices = {
        loader: engine.Loader,
        messageBus,
        stateManager,
        setIsLoading: () => engine.setIsLoading(),
        setIsRunning: () => engine.setIsRunning()
    }
    return new MapManager(services)
}
