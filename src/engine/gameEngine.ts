import type { GameData } from '@data/game/game'
import { GameEngineState, type IGameEngine } from './type'
import { fatalError, logInfo } from '@utility/logMessage'
import { TrackedValue, type ITrackedValue } from '@utility/trackedState'
import { MessageBus } from '@utility/messageBus'
import { END_TURN_MESSAGE, ENGINE_STATE_CHANGED_MESSAGE } from './messages'
import type { IMessageBus } from '@utility/types'

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
    private messageBus: IMessageBus
    private endingTurn: boolean = false

    constructor(game: GameData) {
        this.messageBus = new MessageBus(() => this.handleOnQueueEmpty())

        this.game = game
        logInfo('Game engine initialized with game: {0}', this.game)
        this._state = new TrackedValue<GameEngineState>(
            'GameEngine.State',
            GameEngineState.init,
             (newValue, oldValue) => {
                this.messageBus.postMessage({
                    message: ENGINE_STATE_CHANGED_MESSAGE,
                    payload: {
                        oldState: oldValue,
                        newState: newValue
                    }
                })        
             }
        )
        setGameEngine(this)
    }

    private handleOnQueueEmpty() {
        if (this.endingTurn) {
            this.endingTurn = false
            return
        }
        this.endingTurn = true
        this.messageBus.postMessage({
            message: END_TURN_MESSAGE,
            payload: null
        })
    }

    start(): void {
        logInfo('Game engine started')
    }

    translate(key: string, language: string): string {
        const lang = this.game.translations.languages[language]
        if (!lang) return key
        return lang.translations[key] ?? key
    }

    get State(): ITrackedValue<GameEngineState> {
        return this._state
    }

}
