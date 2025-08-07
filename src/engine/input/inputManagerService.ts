import { InputManager, type IInputManager, type InputManagerServices } from './inputManager'
import { InputSourceTracker } from './inputSourceTracker'
import { InputMatrixBuilder } from './inputMatrixBuilder'
import type { Action } from '@loader/data/action'
import type { Condition } from '@loader/data/condition'
import type { Message } from '@utils/types'
import type { IStateManager } from '../core/stateManager'
import type { ContextData } from '../core/context'
import type { IMessageBus } from '@utils/messageBus'
import type { ITranslationService } from '../dialog/translationService'
import type { IVirtualInputHandler } from './virtualInputHandler'

export function createInputManager(
    messageBus: IMessageBus,
    stateManager: IStateManager<ContextData>,
    translationService: ITranslationService,
    virtualInputHandler: IVirtualInputHandler,
    executeAction: (action: Action, message?: Message) => void,
    resolveCondition: (condition: Condition | null) => boolean
): IInputManager {
    const inputSourceTracker = new InputSourceTracker({
        messageBus,
        stateManager,
        resolveCondition
    })

    const inputMatrixBuilder = new InputMatrixBuilder({
        translationService,
        virtualInputHandler
    })

    const services: InputManagerServices = {
        messageBus,
        inputSourceTracker,
        inputMatrixBuilder,
        executeAction
    }
    return new InputManager(services)
}

