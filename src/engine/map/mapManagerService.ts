import { MapManager, type IMapManager, type MapManagerServices } from './mapManager'
import type { IStateManager } from '../core/stateManager'
import type { ContextData } from '../core/context'
import type { IMessageBus } from '@utils/messageBus'
import type { Action } from '@loader/data/action'
import type { Message } from '@utils/types'
import type { IMapLoader } from '@loader/mapLoader'
import type { ITileLoader } from '@loader/tileLoader'
import { MapLoaderService, type MapLoaderServiceDependencies } from './mapLoaderService'

export function createMapManager(
    messageBus: IMessageBus,
    stateManager: IStateManager<ContextData>,
    mapLoader: IMapLoader,
    tileLoader: ITileLoader,
    executeAction: (action: Action, message?: Message) => void,
    setIsLoading: () => void,
    setIsRunning: () => void
): IMapManager {
    const loaderServices: MapLoaderServiceDependencies = {
        mapLoader,
        tileLoader,
        messageBus,
        stateManager,
        setIsLoading,
        setIsRunning,
    }
    const mapLoaderService = new MapLoaderService(loaderServices)

    const services: MapManagerServices = {
        messageBus,
        stateManager,
        executeAction,
        mapLoaderService,
    }
    return new MapManager(services)
}
