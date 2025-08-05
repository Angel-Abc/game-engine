import type { IGameEngine } from './gameEngine'
import { InputManager, type IInputManager, type InputManagerServices } from './inputManager'
import { InputSourceTracker } from './inputSourceTracker'
import { InputMatrixBuilder } from './inputMatrixBuilder'
import type { Action } from '@loader/data/action'
import type { IStateManager } from './stateManager'
import type { ContextData } from './context'

export function createInputManager(
    engine: IGameEngine,
    stateManager: IStateManager<ContextData>
): IInputManager {
    const inputSourceTracker = new InputSourceTracker({
        messageBus: engine.MessageBus,
        stateManager,
        resolveCondition: (condition) => engine.resolveCondition(condition)
    })

    const inputMatrixBuilder = new InputMatrixBuilder({
        translationService: engine.TranslationService,
        virtualInputHandler: engine.VirtualInputHandler
    })

    const services: InputManagerServices = {
        messageBus: engine.MessageBus,
        inputSourceTracker,
        inputMatrixBuilder,
        executeAction: (action: Action) => engine.executeAction(action)
    }
    return new InputManager(services)
}

