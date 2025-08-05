import type { IGameEngine } from './gameEngine'
import { OutputManager, type IOutputManager } from './outputManager'

export function createOutputManager(engine: IGameEngine): IOutputManager {
    return new OutputManager({ messageBus: engine.MessageBus })
}
