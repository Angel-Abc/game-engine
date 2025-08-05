import type { IGameEngine } from './gameEngine'
import { InputManager, type IInputManager, type InputManagerServices } from './inputManager'
import { InputSourceTracker } from './inputSourceTracker'
import { InputMatrixBuilder } from './inputMatrixBuilder'
import type { Action } from '@loader/data/action'
import type { IStateManager } from './stateManager'
import type { ContextData } from './context'
import type { IMessageBus } from '@utils/messageBus'

export function createInputManager(
    engine: IGameEngine,
    messageBus: IMessageBus,
    stateManager: IStateManager<ContextData>
): IInputManager {
    const inputSourceTracker = new InputSourceTracker({
        messageBus,
        stateManager,
        resolveCondition: (condition) => engine.resolveCondition(condition)
    })

    const inputMatrixBuilder = new InputMatrixBuilder({
        translationService: engine.TranslationService,
        virtualInputHandler: engine.VirtualInputHandler
    })

    const services: InputManagerServices = {
        messageBus,
        inputSourceTracker,
        inputMatrixBuilder,
        executeAction: (action: Action) => engine.executeAction(action)
    }
    return new InputManager(services)
}

