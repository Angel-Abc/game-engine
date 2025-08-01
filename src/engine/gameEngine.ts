import { fatalError, logInfo } from '@utils/logMessage'
import { MessageBus, type IMessageBus } from '@utils/messageBus'
import type { ILoader } from '@loader/loader'
import { END_TURN_MESSAGE, ENGINE_STATE_CHANGED_MESSAGE, SWITCH_PAGE_MESSAGE } from './messages'
import { StateManager, type IStateManager } from './stateManager'
import { ChangeTracker } from './changeTracker'
import { TrackedValue, type ITrackedValue } from '@utils/trackedState'
import { TranslationService, type ITranslationService } from './translationService'
import { PageManager, type IPageManager } from './pageManager'
import type { Page } from '@loader/data/page'
import type { Action } from '@loader/data/action'
import type { CleanUp } from '@utils/types'
import { MapManager, type IMapManager } from './mapManager'
import type { TileSet } from '@loader/data/tile'
import type { GameMap } from '@loader/data/map'

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
    maps: Record<string, GameMap>,
    tileSets: Record<string, TileSet>,
    data: {
        activePage: string | null,
        [key: string]: unknown
    }
}

export interface IGameEngine {
    start(): Promise<void>
    cleanup(): void
    executeAction(action: Action): void
    setIsLoading(): void
    setIsRunning(): void
    get StateManager(): IStateManager<ContextData>
    get State(): ITrackedValue<GameEngineState>
    get TranslationService(): ITranslationService
    get Loader(): ILoader
    get MessageBus(): IMessageBus
    get PageManager(): IPageManager
    get MapManager(): IMapManager
}

export class GameEngine implements IGameEngine {
    private loader: ILoader
    private messageBus: MessageBus
    private stateManager: IStateManager<ContextData> | null = null
    private translationService: ITranslationService
    private pageManager: IPageManager
    private mapManager: IMapManager

    private endingTurn: boolean = false
    private currentLanguage: string | null = null
    private state: ITrackedValue<GameEngineState>
    private handlerCleanupList: CleanUp[] = []
    private loadCounter: number = 0

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
        this.mapManager = new MapManager(this)
        setGameEngine(this)
    }

    public async start(): Promise<void> {
        this.state.value = GameEngineState.loading
        await this.loader.reset()
        await this.registerGameHandlers()
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
        this.mapManager.cleanup()
        this.cleanupHandlers()
    }

    public executeAction(action: Action): void {
        switch (action.type) {
            case 'post-message':
                this.messageBus.postMessage({
                    message: action.message,
                    payload: action.payload
                })
                break
            default:
                fatalError('Unsupported action type')
        }
    }

    public setIsLoading(): void {
        if (this.loadCounter === 0) {
            this.State.value = GameEngineState.loading
        }
        this.loadCounter += 1
    }
    
    public setIsRunning(): void {
        this.loadCounter -= 1
        if (this.loadCounter === 0) {
            this.State.value = GameEngineState.running
        }
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

    public get MapManager(): IMapManager {
        return this.mapManager
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
        this.stateManager?.commitTurn()
        // TODO: Remove when game engine has implemented load and save
        logInfo('Current state manager state: {0}', this.stateManager?.save())
    }

    private initStateManager(): void {
        const contextData: ContextData = {
            language: this.loader.Game.initialData.language,
            pages: {},
            maps: {},
            tileSets: {},
            data: {
                activePage: null,
                activeMap: null
            }
        }
        this.stateManager = new StateManager<ContextData>(contextData, new ChangeTracker<ContextData>())
    }

    private initializeMessageListeners(): void {
        this.messageBus.registerNotificationMessage(END_TURN_MESSAGE)
        this.messageBus.registerNotificationMessage(ENGINE_STATE_CHANGED_MESSAGE)
    }

    private cleanupHandlers() {
        this.handlerCleanupList.forEach(c => c())
        this.handlerCleanupList = []
    }

    private async registerGameHandlers(): Promise<void> {
        this.cleanupHandlers()
        const handlerFiles = this.loader.Game.handlers
        for (const path of handlerFiles) {
            const handlers = await this.loader.loadHandlers(path)
            handlers.forEach(handler => {
                const cleanup = this.messageBus.registerMessageListener(
                    handler.message,
                    () => this.executeAction(handler.action)
                )
                this.handlerCleanupList.push(cleanup)
            })
        }
    }
}