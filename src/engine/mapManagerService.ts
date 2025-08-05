import type { IGameEngine } from './gameEngine'
import { MapManager, type IMapManager, type MapManagerServices } from './mapManager'
import type { IStateManager } from './stateManager'
import type { ContextData } from './context'

export function createMapManager(
    engine: IGameEngine,
    stateManager: IStateManager<ContextData>
): IMapManager {
    const services: MapManagerServices = {
        loader: engine.Loader,
        messageBus: engine.MessageBus,
        stateManager,
        setIsLoading: () => engine.setIsLoading(),
        setIsRunning: () => engine.setIsRunning()
    }
    return new MapManager(services)
}
