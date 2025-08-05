import type { IGameEngine } from './gameEngine'
import { InputManager, type IInputManager, type InputManagerServices } from './inputManager'
import { InputSourceTracker } from './inputSourceTracker'
import { InputMatrixBuilder } from './inputMatrixBuilder'
import type { Action } from '@loader/data/action'
import type { IStateManager } from './stateManager'
import type { ContextData } from './context'
import type { IMessageBus } from '@utils/messageBus'
import type { ITranslationService } from './translationService'
import type { IVirtualInputHandler } from './virtualInputHandler'

export function createInputManager(
    engine: IGameEngine,
    messageBus: IMessageBus,
    stateManager: IStateManager<ContextData>,
    translationService: ITranslationService,
    virtualInputHandler: IVirtualInputHandler
): IInputManager {
    const inputSourceTracker = new InputSourceTracker({
        messageBus,
        stateManager,
        resolveCondition: (condition) => engine.resolveCondition(condition)
    })

    const inputMatrixBuilder = new InputMatrixBuilder({
        translationService,
        virtualInputHandler
    })

    const services: InputManagerServices = {
        messageBus,
        inputSourceTracker,
        inputMatrixBuilder,
        executeAction: (action: Action) => engine.executeAction(action)
    }
    return new InputManager(services)
}

