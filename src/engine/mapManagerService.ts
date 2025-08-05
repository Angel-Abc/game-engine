import type { IGameEngine } from './gameEngine'
import { MapManager, type IMapManager, type MapManagerServices } from './mapManager'

export function createMapManager(engine: IGameEngine): IMapManager {
    const services: MapManagerServices = {
        loader: engine.Loader,
        messageBus: engine.MessageBus,
        stateManager: engine.StateManager,
        setIsLoading: () => engine.setIsLoading(),
        setIsRunning: () => engine.setIsRunning()
    }
    return new MapManager(services)
}
