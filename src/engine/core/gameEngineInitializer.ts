import type { IGameLoader, ILanguageLoader, IHandlerLoader } from '@loader/loader'
import { MessageBus } from '@utils/messageBus'
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
import type { Action } from '@loader/data/action'
import type { Condition } from '@loader/data/condition'
import { TurnScheduler } from './turnScheduler'
import { GameEngine, type IGameEngine } from './gameEngine'
import { HandlerRegistry, type IHandlerRegistry } from './handlerRegistry'
import { StateController } from './stateController'
import { LifecycleManager } from './lifecycleManager'

export interface IEngineManagerFactory {
    createPageManager(engine: IGameEngine, messageBus: MessageBus, stateManager: IStateManager<ContextData>): IPageManager
    createMapManager(engine: IGameEngine, messageBus: MessageBus, stateManager: IStateManager<ContextData>): IMapManager
    createVirtualInputHandler(engine: IGameEngine, messageBus: MessageBus): IVirtualInputHandler
    createInputManager(
        engine: IGameEngine,
        messageBus: MessageBus,
        stateManager: IStateManager<ContextData>,
        translationService: ITranslationService,
        virtualInputHandler: IVirtualInputHandler
    ): IInputManager
    createOutputManager(engine: IGameEngine, messageBus: MessageBus): IOutputManager
    createTranslationService(): ITranslationService
    createDialogManager(engine: IGameEngine, messageBus: MessageBus, stateManager: IStateManager<ContextData>, translationService: ITranslationService): IDialogManager
    createScriptRunner(): IScriptRunner
}

export interface GameEngineOptions {
    actionHandlers?: IActionHandler[]
    conditionResolvers?: IConditionResolver[]
}

export class GameEngineInitializer {
    static initialize(
        loader: IGameLoader & ILanguageLoader & IHandlerLoader,
        factory: IEngineManagerFactory,
        options: GameEngineOptions = {}
    ): GameEngine {
        let engine: GameEngine // eslint-disable-line prefer-const

        const engineProxy = {
            get Loader() { return loader },
            setIsLoading: () => engine.setIsLoading(),
            setIsRunning: () => engine.setIsRunning(),
            executeAction: (action: Action) => engine.executeAction(action),
            resolveCondition: (condition: Condition | null) => engine.resolveCondition(condition)
        } as unknown as IGameEngine

        // Turn scheduler is defined later so it can be referenced by the message queue callback
        // eslint-disable-next-line prefer-const
        let turnScheduler: TurnScheduler
        const messageQueue = new MessageQueue(() => turnScheduler.onQueueEmpty())
        const messageBus = new MessageBus(messageQueue)

        const contextData: ContextData = {
            language: loader.Game.initialData.language,
            pages: {},
            maps: {},
            tileSets: {},
            tiles: {},
            dialogs: {},
            data: {
                activePage: null,
                activeDialog: null,
                isModalDialog: false,
                location: {
                    mapName: null,
                    position: { x: 0, y: 0 },
                    mapSize: { width: 10, height: 10 }
                }
            }
        }
        const stateManager: IStateManager<ContextData> = new StateManager<ContextData>(contextData, new ChangeTracker<ContextData>())
        const translationService = factory.createTranslationService()
        const scriptRunner = factory.createScriptRunner()

        const pageManager = factory.createPageManager(engineProxy, messageBus, stateManager)
        const mapManager = factory.createMapManager(engineProxy, messageBus, stateManager)
        const virtualInputHandler = factory.createVirtualInputHandler(engineProxy, messageBus)
        const inputManager = factory.createInputManager(engineProxy, messageBus, stateManager, translationService, virtualInputHandler)
        const outputManager = factory.createOutputManager(engineProxy, messageBus)
        const dialogManager = factory.createDialogManager(engineProxy, messageBus, stateManager, translationService)
        const handlerRegistry: IHandlerRegistry = new HandlerRegistry()
        const stateController = new StateController(messageBus)
        const lifecycleManager = new LifecycleManager(engineProxy, {
            loader,
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

        engine = new GameEngine(loader, {
            messageBus,
            stateManager,
            translationService,
            pageManager,
            mapManager,
            virtualInputHandler,
            inputManager,
            outputManager,
            dialogManager,
            scriptRunner,
            lifecycleManager,
            handlerRegistry,
            stateController
        })

        pageManager.initialize()
        mapManager.initialize()
        virtualInputHandler.initialize()
        inputManager.initialize()
        outputManager.initialize()
        dialogManager.initialize()

        options.actionHandlers?.forEach(h => engine.registerActionHandler(h))
        options.conditionResolvers?.forEach(r => engine.registerConditionResolver(r))

        return engine
    }
}

