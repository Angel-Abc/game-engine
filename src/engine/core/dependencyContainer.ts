import { MessageBus, type IMessageBus } from '@utils/messageBus'
import { MessageQueue } from '@utils/messageQueue'
import { ChangeTracker } from './changeTracker'
import { StateManager, type IStateManager } from './stateManager'
import type { ContextData } from './context'
import { HandlerRegistry, type IHandlerRegistry } from './handlerRegistry'
import { StateController } from './stateController'
import { LifecycleManager } from './lifecycleManager'
import { TurnScheduler } from './turnScheduler'
import { GameEngine } from './gameEngine'
import type { EngineContext } from './engineContext'
import type { Loader } from '@loader/loader'
import type { IGameLoader } from '@loader/gameLoader'
import type { IPageLoader } from '@loader/pageLoader'
import type { IMapLoader } from '@loader/mapLoader'
import type { ITileLoader } from '@loader/tileLoader'
import type { IDialogLoader } from '@loader/dialogLoader'
import type { IInputLoader } from '@loader/inputsLoader'
import type { IPageManager } from '../page/pageManager'
import type { IMapManager } from '../map/mapManager'
import type { IVirtualInputHandler } from '../input/virtualInputHandler'
import type { IInputManager } from '../input/inputManager'
import type { IOutputManager } from '../output/outputManager'
import type { IDialogManager } from '../dialog/dialogManager'
import type { ITranslationService } from '../dialog/translationService'
import type { IScriptRunner } from '../script/scriptRunner'
import type { Action, BaseAction } from '@loader/data/action'
import type { Condition } from '@loader/data/condition'
import type { Message } from '@utils/types'

export interface DependencyOverrides {
    messageBus?: IMessageBus
    stateManager?: IStateManager<ContextData>
    translationService?: ITranslationService
    scriptRunner?: IScriptRunner
}

export interface EngineDependencyResult {
    engine: GameEngine
    pageManager: IPageManager
    mapManager: IMapManager
    virtualInputHandler: IVirtualInputHandler
    inputManager: IInputManager
    outputManager: IOutputManager
    dialogManager: IDialogManager
}

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
        executeAction: <T extends BaseAction = Action>(action: T, message?: Message, data?: unknown) => void,
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
        executeAction: <T extends BaseAction = Action>(action: T, message?: Message, data?: unknown) => void,
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

export class DependencyContainer {
    private loader: Loader
    private factory: IEngineManagerFactory
    private overrides: DependencyOverrides

    constructor(loader: Loader, factory: IEngineManagerFactory, overrides: DependencyOverrides = {}) {
        this.loader = loader
        this.factory = factory
        this.overrides = overrides
    }

    build(): EngineDependencyResult {
        let engine!: GameEngine // eslint-disable-line prefer-const
        let turnScheduler!: TurnScheduler // eslint-disable-line prefer-const

        const core = this.createCoreDependencies(() => turnScheduler)
        const managers = this.createManagers(core, () => engine)

        const lifecycleManager = new LifecycleManager({
            gameLoader: this.loader.gameLoader,
            languageLoader: this.loader.languageLoader,
            handlerLoader: this.loader.handlerLoader,
            messageBus: core.messageBus,
            stateManager: core.stateManager,
            translationService: core.translationService,
            pageManager: managers.pageManager,
            mapManager: managers.mapManager,
            virtualInputHandler: managers.virtualInputHandler,
            inputManager: managers.inputManager,
            outputManager: managers.outputManager,
            dialogManager: managers.dialogManager,
            handlerRegistry: core.handlerRegistry,
            stateController: core.stateController
        })

        const engineContext: EngineContext = {
            messageBus: core.messageBus,
            stateManager: core.stateManager,
            translationService: core.translationService,
            inputManager: managers.inputManager,
            outputManager: managers.outputManager,
            scriptRunner: core.scriptRunner,
            lifecycleManager,
            handlerRegistry: core.handlerRegistry,
            stateController: core.stateController
        }

        engine = new GameEngine(engineContext)
        turnScheduler = new TurnScheduler(core.stateManager, managers.inputManager, core.messageBus)

        return {
            engine,
            pageManager: managers.pageManager,
            mapManager: managers.mapManager,
            virtualInputHandler: managers.virtualInputHandler,
            inputManager: managers.inputManager,
            outputManager: managers.outputManager,
            dialogManager: managers.dialogManager
        }
    }

    private createCoreDependencies(getTurnScheduler: () => TurnScheduler) {
        let messageBus: IMessageBus
        if (this.overrides.messageBus) {
            messageBus = this.overrides.messageBus
        } else {
            const messageQueue = new MessageQueue(() => getTurnScheduler().onQueueEmpty())
            messageBus = new MessageBus(messageQueue)
        }

        const contextData: ContextData = {
            language: this.loader.gameLoader.Game.initialData.language,
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

        const stateManager: IStateManager<ContextData> = this.overrides.stateManager ?? new StateManager<ContextData>(
            contextData,
            new ChangeTracker<ContextData>()
        )
        const translationService: ITranslationService = this.overrides.translationService ?? this.factory.createTranslationService()
        const scriptRunner: IScriptRunner = this.overrides.scriptRunner ?? this.factory.createScriptRunner()
        const stateController = new StateController(messageBus)
        const handlerRegistry: IHandlerRegistry = new HandlerRegistry()

        return { messageBus, stateManager, translationService, scriptRunner, stateController, handlerRegistry }
    }

    private createManagers(
        core: {
            messageBus: IMessageBus
            stateManager: IStateManager<ContextData>
            translationService: ITranslationService
            handlerRegistry: IHandlerRegistry
            stateController: StateController
        },
        getEngine: () => GameEngine
    ) {
        const setIsLoading = () => core.stateController.setIsLoading()
        const setIsRunning = () => core.stateController.setIsRunning()
        const executeAction = <T extends BaseAction = Action>(action: T, message?: Message, data?: unknown) =>
            core.handlerRegistry.executeAction(getEngine(), action, message, data)
        const resolveCondition = (condition: Condition | null) =>
            core.handlerRegistry.resolveCondition(getEngine(), condition)

        const pageManager = this.factory.createPageManager(
            core.messageBus,
            core.stateManager,
            this.loader.pageLoader,
            setIsLoading,
            setIsRunning
        )
        const mapManager = this.factory.createMapManager(
            core.messageBus,
            core.stateManager,
            this.loader.mapLoader,
            this.loader.tileLoader,
            core.translationService,
            executeAction,
            setIsLoading,
            setIsRunning
        )
        const virtualInputHandler = this.factory.createVirtualInputHandler(
            this.loader.gameLoader,
            this.loader.inputLoader,
            core.messageBus
        )
        const inputManager = this.factory.createInputManager(
            core.messageBus,
            core.stateManager,
            core.translationService,
            virtualInputHandler,
            executeAction,
            resolveCondition
        )
        const outputManager = this.factory.createOutputManager(core.messageBus)
        const dialogManager = this.factory.createDialogManager(
            core.messageBus,
            core.stateManager,
            core.translationService,
            this.loader.dialogLoader,
            setIsLoading,
            setIsRunning,
            resolveCondition
        )

        return {
            pageManager,
            mapManager,
            virtualInputHandler,
            inputManager,
            outputManager,
            dialogManager
        }
    }
}

