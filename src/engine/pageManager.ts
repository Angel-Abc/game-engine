import { logDebug } from '@utils/logMessage'
import { type IGameEngine } from './gameEngine'
import { PAGE_SWITCHED_MESSAGE, SWITCH_PAGE_MESSAGE } from './messages'

export interface IPageManager {
    initialize(): void
    switchPage(page: string): Promise<void>
    cleanup(): void
}

export class PageManager implements IPageManager {
    private gameEngine: IGameEngine
    private unregisterEventHandlers: (() => void)[] = []

    constructor(gameEngine: IGameEngine) {
        this.gameEngine = gameEngine
    }

    public initialize(): void {
        this.unregisterEventHandlers.push(
            this.gameEngine.MessageBus.registerMessageListener(
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
        const context = this.gameEngine.StateManager.state
        if (context.data.activePage === page) return

        this.gameEngine.setIsLoading()
        if (!context.pages[page]) {
            const pageData = await this.gameEngine.Loader.loadPage(page)
            logDebug('page {0} loaded as {1}', page, pageData)
            context.pages[page] = pageData
        }
        context.data.activePage = page
        this.gameEngine.MessageBus.postMessage({
            message: PAGE_SWITCHED_MESSAGE,
            payload: page
        })
        this.gameEngine.setIsRunning()
    }
}

