import { fatalError } from '@utils/logMessage'
import { MessageBus, type IMessageBus } from '@utils/messageBus'
import type { ILoader, IGameLoader, ILanguageLoader, IHandlerLoader } from '@loader/loader'
import type { IStateManager } from './stateManager'
import type { ITrackedValue } from '@utils/trackedState'
import type { ITranslationService } from '../dialog/translationService'
import type { IPageManager } from '../page/pageManager'
import type { Action } from '@loader/data/action'
import type { Message } from '@utils/types'
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
import type { IHandlerRegistry } from './handlerRegistry'
import type { ILifecycleManager } from './lifecycleManager'
import type { IStateController, GameEngineState } from './stateController'

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
    private loader: IGameLoader & ILanguageLoader & IHandlerLoader
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

    private lifecycleManager!: ILifecycleManager
    private handlerRegistry!: IHandlerRegistry
    private stateController!: IStateController

    constructor(loader: IGameLoader & ILanguageLoader & IHandlerLoader) {
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
        lifecycleManager: ILifecycleManager
        handlerRegistry: IHandlerRegistry
        stateController: IStateController
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
        this.lifecycleManager = deps.lifecycleManager
        this.handlerRegistry = deps.handlerRegistry
        this.stateController = deps.stateController
    }

    public async start(): Promise<void> {
        await this.lifecycleManager.start()
    }

    public cleanup(): void {
        this.lifecycleManager.cleanup()
    }

    public registerActionHandler(handler: IActionHandler): void {
        this.handlerRegistry.registerActionHandler(handler)
    }

    public registerConditionResolver(resolver: IConditionResolver): void {
        this.handlerRegistry.registerConditionResolver(resolver)
    }

    public executeAction(action: Action): void {
        this.handlerRegistry.executeAction(this, action)
    }

    public resolveCondition(condition: Condition | null): boolean {
        return this.handlerRegistry.resolveCondition(this, condition)
    }

    public setIsLoading(): void {
        this.stateController.setIsLoading()
    }

    public setIsRunning(): void {
        this.stateController.setIsRunning()
    }

    public get StateManager(): IStateManager<ContextData> {
        if (this.stateManager === null) {
            fatalError('GameEngine', 'State manager is not initialized')
        }
        return this.stateManager
    }

    public get State(): ITrackedValue<GameEngineState> {
        return this.stateController.State
    }

    public get TranslationService(): ITranslationService {
        return this.translationService
    }

    public get Loader(): ILoader {
        return this.loader as ILoader
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

export { GameEngineState } from './stateController'

