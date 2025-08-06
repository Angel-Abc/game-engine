import type { ILoader } from '@loader/loader'
import { MessageBus } from '@utils/messageBus'
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
import { TurnScheduler } from './turnScheduler'
import { GameEngine, type IGameEngine } from './gameEngine'

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
    createDialogManager(engine: IGameEngine, messageBus: MessageBus): IDialogManager
    createTranslationService(): ITranslationService
    createScriptRunner(): IScriptRunner
}

export interface GameEngineOptions {
    actionHandlers?: IActionHandler[]
    conditionResolvers?: IConditionResolver[]
}

export class GameEngineInitializer {
    static initialize(loader: ILoader, factory: IEngineManagerFactory, options: GameEngineOptions = {}): GameEngine {
        const engine = new GameEngine(loader)

        // Turn scheduler is defined later so it can be referenced by the message bus callback
        // eslint-disable-next-line prefer-const
        let turnScheduler: TurnScheduler
        const messageBus = new MessageBus(() => turnScheduler.onQueueEmpty())

        const contextData: ContextData = {
            language: loader.Game.initialData.language,
            pages: {},
            maps: {},
            tileSets: {},
            tiles: {},
            data: {
                activePage: null,
                activeDialog: null,
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

        const pageManager = factory.createPageManager(engine, messageBus, stateManager)
        const mapManager = factory.createMapManager(engine, messageBus, stateManager)
        const virtualInputHandler = factory.createVirtualInputHandler(engine, messageBus)
        const inputManager = factory.createInputManager(engine, messageBus, stateManager, translationService, virtualInputHandler)
        const outputManager = factory.createOutputManager(engine, messageBus)
        const dialogManager = factory.createDialogManager(engine, messageBus)

        turnScheduler = new TurnScheduler(stateManager, inputManager, messageBus)

        engine.initialize({
            messageBus,
            stateManager,
            translationService,
            pageManager,
            mapManager,
            virtualInputHandler,
            inputManager,
            outputManager,
            dialogManager,
            scriptRunner
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

