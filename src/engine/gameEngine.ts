import { fatalError } from '@utils/logMessage'
import { MessageBus, type IMessageBus } from '@utils/messageBus'
import type { ILoader } from 'src/loader/loader'
import { END_TURN_MESSAGE, ENGINE_STATE_CHANGED_MESSAGE, SWITCH_PAGE_MESSAGE } from './messages'
import { StateManager, type IStateManager } from './stateManager'
import { ChangeTracker } from './changeTracker'
import { TrackedValue, type ITrackedValue } from '@utils/trackedState'
import { TranslationService, type ITranslationService } from './translationService'
import { PageManager, type IPageManager } from './pageManager'
import type { Page } from 'src/loader/data/page'

let gameEngine: GameEngine | null = null
function setGameEngine(engine: GameEngine): void {
    gameEngine = engine
}
export function getGameEngine(): IGameEngine {
    if (gameEngine === null) {
        fatalError('Game engine is not initialized')
    }
    return gameEngine
}

export const GameEngineState = {
    init: 0,
    loading: 1,
    running: 2
} as const
export type GameEngineState = typeof GameEngineState[keyof typeof GameEngineState]

export type ContextData = {
    language: string,
    pages: Record<string, Page>,
    data: {
        activePage: Page | null,
        [key: string]: unknown
    }
}

export interface IGameEngine {
    start(): Promise<void>
    cleanup(): void
    get StateManager(): IStateManager<ContextData>
    get State(): ITrackedValue<GameEngineState>
    get TranslationService(): ITranslationService
    get Loader(): ILoader
    get MessageBus(): IMessageBus
    get PageManager(): IPageManager
}

export class GameEngine implements IGameEngine {
    private loader: ILoader
    private messageBus: MessageBus
    private stateManager: IStateManager<ContextData> | null = null
    private translationService: ITranslationService
    private pageManager: IPageManager

    private endingTurn: boolean = false
    private currentLanguage: string | null = null
    private state: ITrackedValue<GameEngineState>

    constructor(loader: ILoader) {
        this.loader = loader
        this.messageBus = new MessageBus(() => this.handleOnQueueEmpty())
        this.initializeMessageListeners()
        this.state = new TrackedValue<GameEngineState>(
            'GameEngine.State',
            GameEngineState.init,
            (newValue, oldValue) => {
                this.messageBus.postMessage({
                    message: ENGINE_STATE_CHANGED_MESSAGE,
                    payload: {
                        oldState: oldValue,
                        newState: newValue
                    }
                })
            }
        )
        this.translationService = new TranslationService()
        this.pageManager = new PageManager(this)
        setGameEngine(this)
    }

    public async start(): Promise<void> {
        this.state.value = GameEngineState.loading
        await this.loader.reset()
        this.initStateManager()
        const language = (this.currentLanguage ?? this.stateManager?.state.language) ?? fatalError('No language set!')
        this.currentLanguage = language
        this.translationService.setLanguage(await this.loader.loadLanguage(language))
        this.state.value = GameEngineState.running
        this.messageBus.postMessage({
            message: SWITCH_PAGE_MESSAGE,
            payload: this.loader.Game.initialData.startPage
        })
    }

    public cleanup(): void {
        this.pageManager.cleanup()
    }

    public get StateManager(): IStateManager<ContextData> {
        if (this.stateManager === null) {
            fatalError('State manager is not initialized')
        }
        return this.stateManager
    }

    public get State(): ITrackedValue<GameEngineState> {
        return this.state
    }

    public get TranslationService(): ITranslationService {
        return this.translationService
    }

    public get Loader(): ILoader {
        return this.loader
    }

    public get MessageBus(): IMessageBus {
        return this.messageBus
    }

    public get PageManager(): IPageManager {
        return this.pageManager
    }

    private handleOnQueueEmpty(): void {
        if (this.endingTurn) {
            this.endTurn()
            this.endingTurn = false
            return
        }
        this.endingTurn = true
        this.messageBus.postMessage({
            message: END_TURN_MESSAGE,
            payload: null
        })
    }

    private endTurn(): void {
        // No code here yet
    }

    private initStateManager(): void {
        const contextData: ContextData = {
            language: this.loader.Game.initialData.language,
            pages: {},
            data: {
                activePage: null
            }
        }
        this.stateManager = new StateManager<ContextData>(contextData, new ChangeTracker<ContextData>())
    }

    private initializeMessageListeners(): void {
        this.messageBus.registerNotificationMessage(END_TURN_MESSAGE)
        this.messageBus.registerNotificationMessage(ENGINE_STATE_CHANGED_MESSAGE)

    }
}