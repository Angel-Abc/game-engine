import { OutputManager, type IOutputManager } from './outputManager'
import type { IMessageBus } from '@utils/messageBus'

export function createOutputManager(messageBus: IMessageBus): IOutputManager {
    return new OutputManager({ messageBus })
}
