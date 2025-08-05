import type { IGameEngine } from './gameEngine'
import { PageManager, type IPageManager, type PageManagerServices } from './pageManager'
import type { IStateManager } from './stateManager'
import type { ContextData } from './context'

export function createPageManager(
    engine: IGameEngine,
    stateManager: IStateManager<ContextData>
): IPageManager {
    const services: PageManagerServices = {
        loader: engine.Loader,
        messageBus: engine.MessageBus,
        stateManager,
        setIsLoading: () => engine.setIsLoading(),
        setIsRunning: () => engine.setIsRunning()
    }
    return new PageManager(services)
}
