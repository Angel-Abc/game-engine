import type { IGameEngine } from './gameEngine'
import { OutputManager, type IOutputManager } from './outputManager'
import type { IMessageBus } from '@utils/messageBus'

export function createOutputManager(_engine: IGameEngine, messageBus: IMessageBus): IOutputManager {
    return new OutputManager({ messageBus })
}
