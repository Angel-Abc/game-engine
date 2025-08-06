import { fatalError } from '@utils/logMessage'
import { MessageBus, type IMessageBus } from '@utils/messageBus'
import type { ILoader } from '@loader/loader'
import { END_TURN_MESSAGE, ENGINE_STATE_CHANGED_MESSAGE, MAP_SWITCHED_MESSAGE, SWITCH_PAGE_MESSAGE } from '../messages/messages'
import type { IStateManager } from './stateManager'
import { TrackedValue, type ITrackedValue } from '@utils/trackedState'
import type { ITranslationService } from '../dialog/translationService'
import type { IPageManager } from '../page/pageManager'
import type { Action } from '@loader/data/action'
import type { CleanUp, Message } from '@utils/types'
import type { IMapManager } from '../map/mapManager'
import type { IVirtualInputHandler } from '../input/virtualInputHandler'
import type { IInputManager } from '../input/inputManager'
import type { IScriptRunner, ScriptContext } from '../script/scriptRunner'
import type { Condition } from '@loader/data/condition'
import type { IOutputManager } from '../output/outputManager'
import type { IDialogManager } from '../dialog/dialogManager'
import type { ContextData } from './context'
import type { IActionHandler } from '../actions/actionHandler'
import type { IConditionResolver } from '../conditions/conditionResolver'

export const GameEngineState = {
    init: 0,
    loading: 1,
    running: 2
} as const
export type GameEngineState = typeof GameEngineState[keyof typeof GameEngineState]

export interface IGameEngine {
    start(): Promise<void>
    cleanup(): void
    executeAction(action: Action): void
    resolveCondition(condition: Condition | null): boolean
    registerActionHandler(handler: IActionHandler): void
    registerConditionResolver(resolver: IConditionResolver): void
    createScriptContext(): ScriptContext
    setIsLoading(): void
    setIsRunning(): void
    get StateManager(): IStateManager<ContextData>
    get State(): ITrackedValue<GameEngineState>
    get TranslationService(): ITranslationService
    get Loader(): ILoader
    get MessageBus(): IMessageBus
    get PageManager(): IPageManager
    get MapManager(): IMapManager
    get InputManager(): IInputManager
    get ScriptRunner(): IScriptRunner
    get VirtualInputHandler(): IVirtualInputHandler
    get OutputManager(): IOutputManager
    get DialogManager(): IDialogManager
}

export class GameEngine implements IGameEngine {
    private loader: ILoader
    private messageBus!: MessageBus
    private stateManager: IStateManager<ContextData> | null = null
    private translationService!: ITranslationService
    private pageManager!: IPageManager
    private mapManager!: IMapManager
    private virtualInputHandler!: IVirtualInputHandler
    private inputManager!: IInputManager
    private scriptRunner!: IScriptRunner
    private outputManager!: IOutputManager
    private dialogManager!: IDialogManager

    private currentLanguage: string | null = null
    private state!: ITrackedValue<GameEngineState>
    private handlerCleanupList: CleanUp[] = []
    private loadCounter: number = 0
    private actionHandlers = new Map<string, IActionHandler>()
    private conditionResolvers = new Map<string, IConditionResolver>()

    constructor(loader: ILoader) {
        this.loader = loader
    }

    public initialize(deps: {
        messageBus: MessageBus
        stateManager: IStateManager<ContextData>
        translationService: ITranslationService
        pageManager: IPageManager
        mapManager: IMapManager
        virtualInputHandler: IVirtualInputHandler
        inputManager: IInputManager
        outputManager: IOutputManager
        dialogManager: IDialogManager
        scriptRunner: IScriptRunner
    }): void {
        this.messageBus = deps.messageBus
        this.stateManager = deps.stateManager
        this.translationService = deps.translationService
        this.pageManager = deps.pageManager
        this.mapManager = deps.mapManager
        this.virtualInputHandler = deps.virtualInputHandler
        this.inputManager = deps.inputManager
        this.outputManager = deps.outputManager
        this.dialogManager = deps.dialogManager
        this.scriptRunner = deps.scriptRunner
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
        this.initializeMessageListeners()
    }

    public async start(): Promise<void> {
        this.state.value = GameEngineState.loading
        await this.loader.reset()
        await this.registerGameHandlers()
        await this.virtualInputHandler.load()
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
        this.virtualInputHandler.cleanup()
        this.inputManager.cleanup()
        this.outputManager.cleanup()
        this.dialogManager.cleanup()
        this.cleanupHandlers()
    }

    public registerActionHandler(handler: IActionHandler): void {
        this.actionHandlers.set(handler.type, handler)
    }

    public registerConditionResolver(resolver: IConditionResolver): void {
        this.conditionResolvers.set(resolver.type, resolver)
    }

    public executeAction(action: Action): void {
        const handler = this.actionHandlers.get(action.type)
        if (handler === undefined) {
            fatalError(`No action handler for type: ${action.type}`)
        }
        handler.handle(this, action)
    }

    public resolveCondition(condition: Condition | null): boolean {
        if (condition === null) return true
        const resolver = this.conditionResolvers.get(condition.type)
        if (resolver === undefined) {
            fatalError(`No condition resolver for type: ${condition.type}`)
        }
        return resolver.resolve(this, condition)
    }

    public setIsLoading(): void {
        this.loadCounter += 1
        if (this.loadCounter === 1) {
            this.State.value = GameEngineState.loading
        }
    }

    public setIsRunning(): void {
        this.loadCounter -= 1
        if (this.loadCounter < 0) {
            fatalError('loadCounter cannot be negative')
        }
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

    public get InputManager(): IInputManager {
        return this.inputManager
    }

    public get ScriptRunner(): IScriptRunner {
        return this.scriptRunner
    }

    public get VirtualInputHandler(): IVirtualInputHandler {
        return this.virtualInputHandler
    }

    public get OutputManager(): IOutputManager {
        return this.outputManager
    }

    public get DialogManager(): IDialogManager {
        return this.dialogManager
    }

    private initializeMessageListeners(): void {
        this.messageBus.registerNotificationMessage(END_TURN_MESSAGE)
        this.messageBus.registerNotificationMessage(ENGINE_STATE_CHANGED_MESSAGE)
        this.messageBus.registerNotificationMessage(MAP_SWITCHED_MESSAGE)
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

    public createScriptContext(): ScriptContext {
        const context: ScriptContext = {
            state: this.StateManager.state,
            postMessage: (message: Message) => {
                this.MessageBus.postMessage(message)
            }
        }
        return context
    }
}

