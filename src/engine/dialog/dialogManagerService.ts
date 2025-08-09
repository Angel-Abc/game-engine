import type { IStateManager } from '@engine/core/stateManager'
import { DialogManager, type DialogManagerServices, type IDialogManager } from './dialogManager'
import type { IMessageBus } from '@utils/messageBus'
import type { ContextData } from '@engine/core/context'
import type { ITranslationService } from './translationService'
import type { Condition } from '@loader/data/condition'

import type { IDialogLoader } from '@loader/dialogLoader'

export function createDialogManager(
    messageBus: IMessageBus,
    stateManager: IStateManager<ContextData>,
    translationService: ITranslationService,
    dialogLoader: IDialogLoader,
    setIsLoading: () => void,
    setIsRunning: () => void,
    resolveCondition: (condition: Condition | null) => boolean
): IDialogManager {
    const services: DialogManagerServices = {
        dialogLoader,
        messageBus,
        stateManager,
        translationService,
        setIsLoading,
        setIsRunning,
        resolveCondition
    }
    return new DialogManager(services)
}
