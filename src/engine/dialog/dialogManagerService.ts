import type { IStateManager } from '@engine/core/stateManager'
import type { IGameEngine } from '../core/gameEngine'
import { DialogManager, type DialogManagerServices, type IDialogManager } from './dialogManager'
import type { IMessageBus } from '@utils/messageBus'
import type { ContextData } from '@engine/core/context'

export function createDialogManager(
    engine: IGameEngine,
    messageBus: IMessageBus,
    stateManager: IStateManager<ContextData>
): IDialogManager {
    const services: DialogManagerServices = {
        loader: engine.Loader,
        messageBus,
        stateManager,
        setIsLoading: () => engine.setIsLoading(),
        setIsRunning: () => engine.setIsRunning(),
        resolveCondition: (condition) => engine.resolveCondition(condition)
    }
    return new DialogManager(services)
}
