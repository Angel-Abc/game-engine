import { PageManager, type IPageManager, type PageManagerServices } from './pageManager'
import type { IStateManager } from '../core/stateManager'
import type { ContextData } from '../core/context'
import type { IMessageBus } from '@utils/messageBus'
import type { IPageLoader } from '@loader/pageLoader'

export function createPageManager(
    messageBus: IMessageBus,
    stateManager: IStateManager<ContextData>,
    pageLoader: IPageLoader,
    setIsLoading: () => void,
    setIsRunning: () => void
): IPageManager {
    const services: PageManagerServices = {
        pageLoader,
        messageBus,
        stateManager,
        setIsLoading,
        setIsRunning
    }
    return new PageManager(services)
}
