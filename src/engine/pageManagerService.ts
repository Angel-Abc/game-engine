import type { IGameEngine } from './gameEngine'
import { PageManager, type IPageManager, type PageManagerServices } from './pageManager'
import type { IStateManager } from './stateManager'
import type { ContextData } from './context'
import type { IMessageBus } from '@utils/messageBus'

export function createPageManager(
    engine: IGameEngine,
    messageBus: IMessageBus,
    stateManager: IStateManager<ContextData>
): IPageManager {
    const services: PageManagerServices = {
        loader: engine.Loader,
        messageBus,
        stateManager,
        setIsLoading: () => engine.setIsLoading(),
        setIsRunning: () => engine.setIsRunning()
    }
    return new PageManager(services)
}
