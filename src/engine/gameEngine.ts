import type { GameData } from '@data/game/game'
import type { VirtualKey, VirtualInput } from '@data/game/virtualInput'
import { GameEngineState, type IGameEngine } from './types'
import { fatalError, logInfo } from '@utility/logMessage'
import { TrackedValue, type ITrackedValue } from '@utility/trackedState'
import { MessageBus } from '@utility/messageBus'
import { END_TURN_MESSAGE, ENGINE_STATE_CHANGED_MESSAGE, ENGINE_SWITCH_PAGE_MESSAGE } from './messages'
import type { IMessageBus, Message } from '@utility/types'
import { VirtualInputHandler, type IVirtualInputHandler } from './virtualInputHandler'
import type { PageModule } from '@data/game/page'

let gameEngine: GameEngine | null = null
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
    private _activePage: PageModule | undefined
    private messageBus: IMessageBus
    private endingTurn: boolean = false
    private inputHandler: IVirtualInputHandler

    constructor(game: GameData) {
        this.messageBus = new MessageBus(() => this.handleOnQueueEmpty())
        this.messageBus.registerNotificationMessage(END_TURN_MESSAGE)
        this.messageBus.registerNotificationMessage(ENGINE_STATE_CHANGED_MESSAGE)
        this.messageBus.registerMessageListener(ENGINE_SWITCH_PAGE_MESSAGE, (message) => this.updatePage(message.payload as string))
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
        const keyMap = new Map<string, VirtualKey>()
        Object.values(this.game.virtualKeys).forEach(k => keyMap.set(k.virtualKey, k))
        const inputMap = new Map<string, VirtualInput>()
        Object.values(this.game.virtualInputs).forEach(i => inputMap.set(i.virtualInput, i))
        this.inputHandler = new VirtualInputHandler(this.messageBus, keyMap, inputMap)
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
        this.messageBus.postMessage({
            message: ENGINE_SWITCH_PAGE_MESSAGE,
            payload: this.game.startPage
        })
    }

    cleanup(): void {
        this.inputHandler.cleanup()
    }

    translate(key: string, language: string): string {
        const lang = this.game.translations.languages[language]
        if (!lang) return key
        return lang.translations[key] ?? key
    }

    get State(): ITrackedValue<GameEngineState> {
        return this._state
    }

    updatePage(page: string): void {
        this._state.value = GameEngineState.loading
        logInfo('Switching to page: {0}', page)
        const module = this.game.modules[page] 
        if (module.type !== 'page') {
            fatalError(`Module ${page} is not a page module`)
        }
        this._activePage = module
        this._state.value = GameEngineState.running
    }

    get ActivePage(): PageModule | undefined {
        return this._activePage
    }

    postMessage(message: Message): void {
        this.messageBus.postMessage(message)
    }
}

