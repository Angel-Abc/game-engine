import type { IGameEngine } from '../core/gameEngine'
import { MapManager, type IMapManager, type MapManagerServices } from './mapManager'
import type { IStateManager } from '../core/stateManager'
import type { ContextData } from '../core/context'
import type { IMessageBus } from '@utils/messageBus'
import type { Action } from '@loader/data/action'
import type { IMapLoader } from '@loader/mapLoader'
import type { ITileLoader } from '@loader/tileLoader'
import { MapLoaderService, type MapLoaderServiceDependencies } from './mapLoaderService'

export function createMapManager(
    engine: IGameEngine,
    messageBus: IMessageBus,
    stateManager: IStateManager<ContextData>,
    mapLoader: IMapLoader,
    tileLoader: ITileLoader
): IMapManager {
    const loaderServices: MapLoaderServiceDependencies = {
        mapLoader,
        tileLoader,
        messageBus,
        stateManager,
        setIsLoading: () => engine.setIsLoading(),
        setIsRunning: () => engine.setIsRunning(),
    }
    const mapLoaderService = new MapLoaderService(loaderServices)

    const services: MapManagerServices = {
        messageBus,
        stateManager,
        executeAction: (action: Action) => engine.executeAction(action),
        mapLoaderService,
    }
    return new MapManager(services)
}
