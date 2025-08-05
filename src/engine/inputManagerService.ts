import type { IGameEngine } from './gameEngine'
import { InputManager, type IInputManager, type InputManagerServices } from './inputManager'

export function createInputManager(engine: IGameEngine): IInputManager {
    const services: InputManagerServices = {
        messageBus: engine.MessageBus,
        translationService: engine.TranslationService,
        virtualInputHandler: engine.VirtualInputHandler,
        stateManager: engine.StateManager,
        resolveCondition: (condition) => engine.resolveCondition(condition),
        executeAction: (action) => engine.executeAction(action)
    }
    return new InputManager(services)
}
