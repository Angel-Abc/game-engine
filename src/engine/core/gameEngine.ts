import type { IMessageBus } from '@utils/messageBus'
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
import type { EngineContext } from './engineContext'

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
    private messageBus: IMessageBus
    private stateManager: IStateManager<ContextData>
    private translationService: ITranslationService
    private pageManager: IPageManager
    private mapManager: IMapManager
    private virtualInputHandler: IVirtualInputHandler
    private inputManager: IInputManager
    private scriptRunner: IScriptRunner
    private outputManager: IOutputManager
    private dialogManager: IDialogManager

    private lifecycleManager: ILifecycleManager
    private handlerRegistry: IHandlerRegistry
    private stateController: IStateController

    constructor(
        context: EngineContext
    ) {
        this.messageBus = context.messageBus
        this.stateManager = context.stateManager
        this.translationService = context.translationService
        this.pageManager = context.pageManager
        this.mapManager = context.mapManager
        this.virtualInputHandler = context.virtualInputHandler
        this.inputManager = context.inputManager
        this.outputManager = context.outputManager
        this.dialogManager = context.dialogManager
        this.scriptRunner = context.scriptRunner
        this.lifecycleManager = context.lifecycleManager
        this.handlerRegistry = context.handlerRegistry
        this.stateController = context.stateController
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
        return this.stateManager
    }

    public get State(): ITrackedValue<GameEngineState> {
        return this.stateController.State
    }

    public get TranslationService(): ITranslationService {
        return this.translationService
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

