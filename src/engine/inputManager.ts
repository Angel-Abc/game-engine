import type { IGameEngine } from './gameEngine'

export interface IInputManager {
    cleanup(): void
}

export class InputManager implements IInputManager {
    private gameEngine: IGameEngine

    constructor (gameEngine: IGameEngine) {
        this.gameEngine = gameEngine
    }

    public cleanup(): void {
        // NO CODE HERE YET
    }
}