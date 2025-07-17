import { logDebug } from '@utility/logMessage'
import { useSyncExternalStore } from 'react'
import { getGameEngine } from 'src/engine/gameEngine'
import { GameEngineState } from 'src/engine/types'

type GameProps = Record<string, never>

const Game: React.FC<GameProps> = (): React.JSX.Element => {
    const engine = getGameEngine()
    const engineState = useSyncExternalStore(engine.State.subscribe.bind(engine.State), () => engine.State.value)

    logDebug('Game component rendered with engine state: {0}', engineState)

    switch (engineState) {
        case GameEngineState.init:
            return <div>Initializing game engine...</div>  
        case GameEngineState.loading:
            return <div>Loading game data...</div>
        case GameEngineState.running:
            return <div>Game is running!</div>
    }
}

export default Game
