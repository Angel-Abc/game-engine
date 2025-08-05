import type { IGameEngine } from './gameEngine'
import { DialogManager, type IDialogManager } from './dialogManager'

export function createDialogManager(engine: IGameEngine): IDialogManager {
    return new DialogManager({ messageBus: engine.MessageBus })
}
