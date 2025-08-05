import type { IGameEngine } from '../core/gameEngine'
import { DialogManager, type IDialogManager } from './dialogManager'
import type { IMessageBus } from '@utils/messageBus'

export function createDialogManager(_engine: IGameEngine, messageBus: IMessageBus): IDialogManager {
    return new DialogManager({ messageBus })
}
