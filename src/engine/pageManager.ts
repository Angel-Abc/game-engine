import { logDebug } from '@utils/logMessage'
import { GameEngineState, type IGameEngine } from './gameEngine'
import { SWITCH_PAGE_MESSAGE } from './messages'

export interface IPageManager {
    switchPage(page: string): Promise<void>
}

export class PageManager implements IPageManager {
    private gameEngine: IGameEngine
    private unregisterEventHandlers: (() => void)[] = []

    constructor(gameEngine: IGameEngine) {
        this.gameEngine = gameEngine
        this.unregisterEventHandlers.push(
            gameEngine.MessageBus.registerMessageListener(
                SWITCH_PAGE_MESSAGE,
                async (message) => this.switchPage(message.payload as string)
            )
        )
    }

    public cleanup(): void {
        this.unregisterEventHandlers.forEach(unregister => unregister())
    }

    public async switchPage(page: string): Promise<void> {
        const context = this.gameEngine.StateManager.state
        if (context.data.activePage?.id === page) return

        this.gameEngine.State.value = GameEngineState.loading
        if (context.pages[page]) {
            context.data.activePage = context.pages[page]
        } else {
            const pageData = await this.gameEngine.Loader.loadPage(page)
            logDebug('page {0} loaded as {1}', page, pageData)
            context.pages[page] = pageData
            context.data.activePage = pageData
        }
        this.gameEngine.State.value = GameEngineState.running
    }
}

