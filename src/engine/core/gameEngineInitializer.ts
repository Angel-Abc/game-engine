import { Loader } from '@loader/loader'
import type { IGameLoader } from '@loader/loader'
import type { IPageLoader } from '@loader/pageLoader'
import type { IMapLoader } from '@loader/mapLoader'
import type { ITileLoader } from '@loader/tileLoader'
import type { IDialogLoader } from '@loader/dialogLoader'
import type { IInputLoader } from '@loader/inputsLoader'
import { MessageBus, type IMessageBus } from '@utils/messageBus'
import { MessageQueue } from '@utils/messageQueue'
import { ChangeTracker } from './changeTracker'
import { StateManager, type IStateManager } from './stateManager'
import type { ContextData } from './context'
import type { IPageManager } from '../page/pageManager'
import type { IMapManager } from '../map/mapManager'
import type { IVirtualInputHandler } from '../input/virtualInputHandler'
import type { IInputManager } from '../input/inputManager'
import type { IOutputManager } from '../output/outputManager'
import type { IDialogManager } from '../dialog/dialogManager'
import type { ITranslationService } from '../dialog/translationService'
import type { IScriptRunner } from '../script/scriptRunner'
import type { IActionHandler } from '../actions/actionHandler'
import type { IConditionResolver } from '../conditions/conditionResolver'
import type { Action, BaseAction } from '@loader/data/action'
import type { Condition } from '@loader/data/condition'
import type { Message } from '@utils/types'
import { TurnScheduler } from './turnScheduler'
import { GameEngine } from './gameEngine'
import { HandlerRegistry, type IHandlerRegistry } from './handlerRegistry'
import { StateController } from './stateController'
import { LifecycleManager } from './lifecycleManager'
import type { EngineContext } from './engineContext'

export interface IEngineManagerFactory {
    createPageManager(
        messageBus: IMessageBus,
        stateManager: IStateManager<ContextData>,
        pageLoader: IPageLoader,
        setIsLoading: () => void,
        setIsRunning: () => void
    ): IPageManager
    createMapManager(
        messageBus: IMessageBus,
        stateManager: IStateManager<ContextData>,
        mapLoader: IMapLoader,
        tileLoader: ITileLoader,
        translationService: ITranslationService,
        executeAction: <T extends BaseAction = Action>(action: T, message?: Message) => void,
        setIsLoading: () => void,
        setIsRunning: () => void
    ): IMapManager
    createVirtualInputHandler(
        gameLoader: IGameLoader,
        inputLoader: IInputLoader,
        messageBus: IMessageBus
    ): IVirtualInputHandler
    createInputManager(
        messageBus: IMessageBus,
        stateManager: IStateManager<ContextData>,
        translationService: ITranslationService,
        virtualInputHandler: IVirtualInputHandler,
        executeAction: <T extends BaseAction = Action>(action: T, message?: Message) => void,
        resolveCondition: (condition: Condition | null) => boolean
    ): IInputManager
    createOutputManager(messageBus: IMessageBus): IOutputManager
    createTranslationService(): ITranslationService
    createDialogManager(
        messageBus: IMessageBus,
        stateManager: IStateManager<ContextData>,
        translationService: ITranslationService,
        dialogLoader: IDialogLoader,
        setIsLoading: () => void,
        setIsRunning: () => void,
        resolveCondition: (condition: Condition | null) => boolean
    ): IDialogManager
    createScriptRunner(): IScriptRunner
}

export interface GameEngineOptions {
    actionHandlers?: IActionHandler<BaseAction>[]
    conditionResolvers?: IConditionResolver[]
}

export class GameEngineInitializer {
    static initialize(
        loader: Loader,
        factory: IEngineManagerFactory,
        options: GameEngineOptions = {},
    ): GameEngine {
        const {
            engine,
            pageManager,
            mapManager,
            virtualInputHandler,
            inputManager,
            outputManager,
            dialogManager
        } = this.setupDependencies(loader, factory)

        this.initializeManagers(
            pageManager,
            mapManager,
            virtualInputHandler,
            inputManager,
            outputManager,
            dialogManager
        )

        this.registerHandlers(engine, options)

        return engine
    }

    private static setupDependencies(
        loader: Loader,
        factory: IEngineManagerFactory
    ) {
        let engine: GameEngine // eslint-disable-line prefer-const

        // Turn scheduler is defined later so it can be referenced by the message queue callback
        // eslint-disable-next-line prefer-const
        let turnScheduler: TurnScheduler
        const messageQueue = new MessageQueue(() => turnScheduler.onQueueEmpty())
        const messageBus: IMessageBus = new MessageBus(messageQueue)

        const contextData: ContextData = {
            language: loader.Game.initialData.language,
            pages: {},
            maps: {},
            tileSets: {},
            tiles: {},
            dialogSets: {},
            dialogs: {
                activeDialog: null,
                isModalDialog: false,
                dialogStates: {}
            },
            data: {
                activePage: null,
                location: {
                    mapName: null,
                    position: { x: 0, y: 0 },
                    mapSize: { width: 10, height: 10 }
                }
            }
        }
        const stateManager: IStateManager<ContextData> = new StateManager<ContextData>(
            contextData,
            new ChangeTracker<ContextData>()
        )
        const translationService = factory.createTranslationService()
        const scriptRunner = factory.createScriptRunner()
        const stateController = new StateController(messageBus)
        const handlerRegistry: IHandlerRegistry = new HandlerRegistry()

        const setIsLoading = () => stateController.setIsLoading()
        const setIsRunning = () => stateController.setIsRunning()
        const executeAction = <T extends BaseAction = Action>(action: T, message?: Message) => handlerRegistry.executeAction(engine, action, message)
        const resolveCondition = (condition: Condition | null) => handlerRegistry.resolveCondition(engine, condition)

        const pageManager = factory.createPageManager(messageBus, stateManager, loader.pageLoader, setIsLoading, setIsRunning)
        const mapManager = factory.createMapManager(
            messageBus,
            stateManager,
            loader.mapLoader,
            loader,
            translationService,
            executeAction,
            setIsLoading,
            setIsRunning
        )
        const virtualInputHandler = factory.createVirtualInputHandler(loader, loader, messageBus)
        const inputManager = factory.createInputManager(
            messageBus,
            stateManager,
            translationService,
            virtualInputHandler,
            executeAction,
            resolveCondition
        )
        const outputManager = factory.createOutputManager(messageBus)
        const dialogManager = factory.createDialogManager(
            messageBus,
            stateManager,
            translationService,
            loader,
            setIsLoading,
            setIsRunning,
            resolveCondition
        )
        const lifecycleManager = new LifecycleManager({
            gameLoader: loader,
            languageLoader: loader.languageLoader,
            handlerLoader: loader,
            messageBus,
            stateManager,
            translationService,
            pageManager,
            mapManager,
            virtualInputHandler,
            inputManager,
            outputManager,
            dialogManager,
            handlerRegistry,
            stateController
        })

        turnScheduler = new TurnScheduler(stateManager, inputManager, messageBus)

        const engineContext: EngineContext = {
            messageBus,
            stateManager,
            translationService,
            inputManager,
            outputManager,
            scriptRunner,
            lifecycleManager,
            handlerRegistry,
            stateController
        }

        engine = new GameEngine(engineContext)

        return {
            engine,
            pageManager,
            mapManager,
            virtualInputHandler,
            inputManager,
            outputManager,
            dialogManager
        }
    }

    private static initializeManagers(
        pageManager: IPageManager,
        mapManager: IMapManager,
        virtualInputHandler: IVirtualInputHandler,
        inputManager: IInputManager,
        outputManager: IOutputManager,
        dialogManager: IDialogManager
    ) {
        pageManager.initialize()
        mapManager.initialize()
        virtualInputHandler.initialize()
        inputManager.initialize()
        outputManager.initialize()
        dialogManager.initialize()
    }

    private static registerHandlers(engine: GameEngine, options: GameEngineOptions) {
        options.actionHandlers?.forEach(h => engine.registerActionHandler(h))
        options.conditionResolvers?.forEach(r => engine.registerConditionResolver(r))
    }
}
