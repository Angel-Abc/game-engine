import type { IMessageBus } from '@utils/messageBus'
import type { IStateManager } from './stateManager'
import type { ITrackedValue } from '@utils/trackedState'
import type { ITranslationService } from '../dialog/translationService'
import type { Action, BaseAction } from '@loader/data/action'
import type { Message } from '@utils/types'
import type { IInputManager } from '../input/inputManager'
import type { IScriptRunner, ScriptContext } from '../script/scriptRunner'
import type { Condition } from '@loader/data/condition'
import type { IOutputManager } from '../output/outputManager'
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
    registerActionHandler(handler: IActionHandler<BaseAction>): void
    registerConditionResolver(resolver: IConditionResolver): void
    createScriptContext(message?: Message): ScriptContext
    setIsLoading(): void
    setIsRunning(): void
    get StateManager(): IStateManager<ContextData>
    get State(): ITrackedValue<GameEngineState>
    get TranslationService(): ITranslationService
    get MessageBus(): IMessageBus
    get InputManager(): IInputManager
    get ScriptRunner(): IScriptRunner
    get OutputManager(): IOutputManager
}

export class GameEngine implements IGameEngine {
    private messageBus: IMessageBus
    private stateManager: IStateManager<ContextData>
    private translationService: ITranslationService
    private inputManager: IInputManager
    private scriptRunner: IScriptRunner
    private outputManager: IOutputManager

    private lifecycleManager: ILifecycleManager
    private handlerRegistry: IHandlerRegistry
    private stateController: IStateController

    constructor(
        context: EngineContext
    ) {
        this.messageBus = context.messageBus
        this.stateManager = context.stateManager
        this.translationService = context.translationService
        this.inputManager = context.inputManager
        this.outputManager = context.outputManager
        this.scriptRunner = context.scriptRunner
        this.lifecycleManager = context.lifecycleManager
        this.handlerRegistry = context.handlerRegistry
        this.stateController = context.stateController
    }

    public async start(): Promise<void> {
        await this.lifecycleManager.start(this)
    }

    public cleanup(): void {
        this.lifecycleManager.cleanup()
    }

    public registerActionHandler(handler: IActionHandler<BaseAction>): void {
        this.handlerRegistry.registerActionHandler(handler)
    }

    public registerConditionResolver(resolver: IConditionResolver): void {
        this.handlerRegistry.registerConditionResolver(resolver)
    }

    public executeAction(action: Action): void {
        this.handlerRegistry.executeAction(this, action, undefined)
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

    public get InputManager(): IInputManager {
        return this.inputManager
    }

    public get ScriptRunner(): IScriptRunner {
        return this.scriptRunner
    }

    public get OutputManager(): IOutputManager {
        return this.outputManager
    }

    public createScriptContext(message?: Message): ScriptContext {
        const context: ScriptContext = {
            state: this.StateManager.state,
            postMessage: (msg: Message) => {
                this.MessageBus.postMessage(msg)
            },
            triggerMessage: message?.message,
            triggerPayload: message?.payload
        }
        return context
    }
}

export { GameEngineState } from './stateController'

