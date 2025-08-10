import { Loader } from '@loader/loader'
import type { IEngineManagerFactory } from './dependencyContainer'
import { DependencyContainer, type DependencyOverrides } from './dependencyContainer'
import type { IActionHandler } from '../actions/actionHandler'
import type { IConditionResolver } from '../conditions/conditionResolver'
import type { BaseAction } from '@loader/data/action'
import { GameEngine } from './gameEngine'
import type { IPageManager } from '../page/pageManager'
import type { IMapManager } from '../map/mapManager'
import type { IVirtualInputHandler } from '../input/virtualInputHandler'
import type { IInputManager } from '../input/inputManager'
import type { IOutputManager } from '../output/outputManager'
import type { IDialogManager } from '../dialog/dialogManager'

export interface GameEngineOptions {
    actionHandlers?: IActionHandler<BaseAction>[]
    conditionResolvers?: IConditionResolver[]
    dependencies?: DependencyOverrides
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
        } = new DependencyContainer(loader, factory, options.dependencies).build()

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

export type { IEngineManagerFactory, DependencyOverrides } from './dependencyContainer'
