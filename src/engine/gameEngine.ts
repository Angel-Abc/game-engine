import { fatalError } from '@utils/logMessage'
import { MessageBus } from '@utils/messageBus'
import type { ILoader } from 'src/loader/loader'
import { END_TURN_MESSAGE, ENGINE_STATE_CHANGED_MESSAGE } from './messages'
import { StateManager, type IStateManager } from './stateManager'
import { ChangeTracker } from './changeTracker'
import { TrackedValue, type ITrackedValue } from '@utils/trackedState'
import { TranslationService, type ITranslationService } from './translationService'

const gameEngine: GameEngine | null = null
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
    data: Record<string, unknown>
}

export interface IGameEngine {
    start(): Promise<void>
    get StateManager(): IStateManager<ContextData>
    get State(): ITrackedValue<GameEngineState>
    get TranslationService(): ITranslationService
}

export class GameEngine implements IGameEngine {
    private loader: ILoader
    private messageBus: MessageBus
    private stateManager: IStateManager<ContextData> | null = null
    private translationService: ITranslationService

    private endingTurn: boolean = false
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
    }

    public async start(): Promise<void> {
        this.state.value = GameEngineState.loading
        await this.loader.reset()
        this.initStateManager()
        const language = this.stateManager?.state.language ?? fatalError('No language set!')
        this.translationService.setLanguage(await this.loader.loadLanguage(language))
        this.state.value = GameEngineState.running
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
            data: { }
        }
        this.stateManager = new StateManager<ContextData>(contextData, new ChangeTracker<ContextData>())
    }

    private initializeMessageListeners(): void {
        this.messageBus.registerNotificationMessage(END_TURN_MESSAGE)
        this.messageBus.registerNotificationMessage(ENGINE_STATE_CHANGED_MESSAGE)

    }
}