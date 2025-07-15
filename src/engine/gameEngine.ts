import type { GameData } from '@data/game/game'
import { GameEngineState, type IGameEngine } from './type'
import { fatalError, logDebug, logInfo } from '@utility/logMessage'
import { TrackedValue, type ITrackedValue } from '@utility/trackedState'

let gameEngine: GameEngine | null = null;
export function getGameEngine(): IGameEngine {
    if (gameEngine === null) {
        fatalError('Game engine is not initialized')
    }  
    return gameEngine
}

function setGameEngine(engine: GameEngine): void {
    if (gameEngine !== null) {
        fatalError('Game engine is already initialized')
    }
    gameEngine = engine
}

export class GameEngine implements IGameEngine {
    private game: GameData
    private _state: ITrackedValue<GameEngineState>

    constructor(game: GameData) {
        this.game = game
        logInfo('Game engine initialized with game: {0}', this.game.title)
        this._state = new TrackedValue<GameEngineState>(
            'GameEngine.State',
            GameEngineState.init,
            (newValue, oldValue) => {
                logDebug('Game engine state changed from {0} to {1}', oldValue, newValue)
            }
        )
        setGameEngine(this)
    }

    start(): void {
        logInfo('Game engine started')
    }

    get State(): ITrackedValue<GameEngineState> {
        return this._state
    }

}