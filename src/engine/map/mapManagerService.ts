import type { IGameEngine } from '../core/gameEngine'
import { MapManager, type IMapManager, type MapManagerServices } from './mapManager'
import type { IStateManager } from '../core/stateManager'
import type { ContextData } from '../core/context'
import type { IMessageBus } from '@utils/messageBus'
import type { Action } from '@loader/data/action'

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
        setIsRunning: () => engine.setIsRunning(),
        executeAction: (action: Action) => engine.executeAction(action)
    }
    return new MapManager(services)
}
