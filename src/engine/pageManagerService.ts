import type { IGameEngine } from './gameEngine'
import { PageManager, type IPageManager, type PageManagerServices } from './pageManager'

export function createPageManager(engine: IGameEngine): IPageManager {
    const services: PageManagerServices = {
        loader: engine.Loader,
        messageBus: engine.MessageBus,
        stateManager: engine.StateManager,
        setIsLoading: () => engine.setIsLoading(),
        setIsRunning: () => engine.setIsRunning()
    }
    return new PageManager(services)
}
