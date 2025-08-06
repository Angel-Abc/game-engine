import { logDebug } from '@utils/logMessage'
import { loadOnce } from '@utils/loadOnce'
import type { IPageLoader } from '@loader/pageLoader'
import type { IMessageBus } from '@utils/messageBus'
import type { IStateManager } from '../core/stateManager'
import type { ContextData } from '../core/context'
import { PAGE_SWITCHED_MESSAGE, SWITCH_PAGE_MESSAGE } from '../messages/messages'

export interface IPageManager {
    initialize(): void
    switchPage(page: string): Promise<void>
    cleanup(): void
}

export type PageManagerServices = {
    pageLoader: IPageLoader
    messageBus: IMessageBus
    stateManager: IStateManager<ContextData>
    setIsLoading: () => void
    setIsRunning: () => void
}

export class PageManager implements IPageManager {
    private services: PageManagerServices
    private unregisterEventHandlers: (() => void)[] = []

    constructor(services: PageManagerServices) {
        this.services = services
    }

    public initialize(): void {
        this.unregisterEventHandlers.push(
            this.services.messageBus.registerMessageListener(
                SWITCH_PAGE_MESSAGE,
                async (message) => this.switchPage(message.payload as string)
            )
        )
    }

    public cleanup(): void {
        this.unregisterEventHandlers.forEach(unregister => unregister())
        this.unregisterEventHandlers = []
    }

    public async switchPage(page: string): Promise<void> {
        const context = this.services.stateManager.state
        if (context.data.activePage === page) return

        await loadOnce(
            context.pages,
            page,
            async () => {
                const pageData = await this.services.pageLoader.loadPage(page)
                logDebug('PageManager', 'page {0} loaded as {1}', page, pageData)
                return pageData
            },
            this.services.setIsLoading,
            this.services.setIsRunning,
        )

        context.data.activePage = page
        this.services.messageBus.postMessage({
            message: PAGE_SWITCHED_MESSAGE,
            payload: page
        })
    }
}

