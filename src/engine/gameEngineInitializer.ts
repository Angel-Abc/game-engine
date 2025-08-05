import type { ILoader } from '@loader/loader'
import { MessageBus } from '@utils/messageBus'
import { ChangeTracker } from './changeTracker'
import { StateManager, type IStateManager } from './stateManager'
import type { ContextData } from './context'
import type { IPageManager } from './pageManager'
import type { IMapManager } from './mapManager'
import type { IVirtualInputHandler } from './virtualInputHandler'
import type { IInputManager } from './inputManager'
import type { IOutputManager } from './outputManager'
import type { IDialogManager } from './dialogManager'
import type { ITranslationService } from './translationService'
import type { IScriptRunner } from './scriptRunner'
import type { IActionHandler } from './actions/actionHandler'
import type { IConditionResolver } from './conditions/conditionResolver'
import { TurnScheduler } from './turnScheduler'
import { GameEngine, type IGameEngine } from './gameEngine'

export interface IEngineManagerFactory {
    createPageManager(engine: IGameEngine, messageBus: MessageBus, stateManager: IStateManager<ContextData>): IPageManager
    createMapManager(engine: IGameEngine, stateManager: IStateManager<ContextData>): IMapManager
    createVirtualInputHandler(engine: IGameEngine): IVirtualInputHandler
    createInputManager(engine: IGameEngine, stateManager: IStateManager<ContextData>): IInputManager
    createOutputManager(engine: IGameEngine): IOutputManager
    createDialogManager(engine: IGameEngine): IDialogManager
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
                location: {
                    mapName: null,
                    position: { x: 9, y: 6 },
                    mapSize: { width: 10, height: 10 }
                }
            }
        }
        const stateManager: IStateManager<ContextData> = new StateManager<ContextData>(contextData, new ChangeTracker<ContextData>())
        const translationService = factory.createTranslationService()
        const scriptRunner = factory.createScriptRunner()

        const pageManager = factory.createPageManager(engine, messageBus, stateManager)
        const mapManager = factory.createMapManager(engine, stateManager)
        const virtualInputHandler = factory.createVirtualInputHandler(engine)
        const inputManager = factory.createInputManager(engine, stateManager)
        const outputManager = factory.createOutputManager(engine)
        const dialogManager = factory.createDialogManager(engine)

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

