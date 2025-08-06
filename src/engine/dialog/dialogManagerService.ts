import type { IStateManager } from '@engine/core/stateManager'
import type { IGameEngine } from '../core/gameEngine'
import { DialogManager, type DialogManagerServices, type IDialogManager } from './dialogManager'
import type { IMessageBus } from '@utils/messageBus'
import type { ContextData } from '@engine/core/context'
import type { IDialogLoader } from '@loader/dialogLoader'
import type { ITranslationService } from './translationService'

export function createDialogManager(
    engine: IGameEngine,
    messageBus: IMessageBus,
    stateManager: IStateManager<ContextData>,
    translationService: ITranslationService
): IDialogManager {
    const services: DialogManagerServices = {
        dialogLoader: engine.Loader as IDialogLoader,
        messageBus,
        stateManager,
        translationService,
        setIsLoading: () => engine.setIsLoading(),
        setIsRunning: () => engine.setIsRunning(),
        resolveCondition: (condition) => engine.resolveCondition(condition)
    }
    return new DialogManager(services)
}
