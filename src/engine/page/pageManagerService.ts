import type { IGameEngine } from '../core/gameEngine'
import { PageManager, type IPageManager, type PageManagerServices } from './pageManager'
import type { IStateManager } from '../core/stateManager'
import type { ContextData } from '../core/context'
import type { IMessageBus } from '@utils/messageBus'
import type { IPageLoader } from '@loader/pageLoader'

export function createPageManager(
    engine: IGameEngine,
    messageBus: IMessageBus,
    stateManager: IStateManager<ContextData>
): IPageManager {
    const services: PageManagerServices = {
        pageLoader: engine.Loader as IPageLoader,
        messageBus,
        stateManager,
        setIsLoading: () => engine.setIsLoading(),
        setIsRunning: () => engine.setIsRunning()
    }
    return new PageManager(services)
}
