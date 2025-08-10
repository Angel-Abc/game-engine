import type { IMessageBus } from '@utils/messageBus'
import type { IStateManager } from './stateManager'
import type { ContextData } from './context'
import type { ITranslationService } from '../dialog/translationService'
import type { IInputManager } from '../input/inputManager'
import type { IOutputManager } from '../output/outputManager'
import type { IScriptRunner } from '../script/scriptRunner'
import type { ILifecycleManager } from './lifecycleManager'
import type { IHandlerRegistry } from './handlerRegistry'
import type { IStateController } from './stateController'

export interface EngineContext {
    messageBus: IMessageBus
    stateManager: IStateManager<ContextData>
    translationService: ITranslationService
    inputManager: IInputManager
    outputManager: IOutputManager
    scriptRunner: IScriptRunner
    lifecycleManager: ILifecycleManager
    handlerRegistry: IHandlerRegistry
    stateController: IStateController
}
