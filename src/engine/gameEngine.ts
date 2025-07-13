import type { Game } from '@data/load/game'
import type { IGameEngine } from './type'
import { logInfo } from '@utility/logMessage'

export class GameEngine implements IGameEngine {
    private game: Game

    constructor(game: Game) {
        this.game = game
        logInfo("Game engine initialized with game: {0}", this.game.title)
    }

    start(): void {
        logInfo("Game engine started");
    }
}