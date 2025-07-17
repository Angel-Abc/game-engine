import { logDebug } from '@utility/logMessage'
import { useSyncExternalStore } from 'react'
import { getGameEngine } from '@engine/gameEngine'
import { GameEngineState } from '@engine/types'
import Page from './page'

type GameProps = Record<string, never>

const Game: React.FC<GameProps> = (): React.JSX.Element => {
    const engine = getGameEngine()
    const engineState = useSyncExternalStore(engine.State.subscribe.bind(engine.State), () => engine.State.value)

    logDebug('Game component rendered with engine state: {0}', engineState)
    const activePage = engine.ActivePage

    switch (engineState) {
        case GameEngineState.init:
            return <div>Initializing game engine...</div>  
        case GameEngineState.loading:
            return <div>Loading game data...</div>
        case GameEngineState.running:
            if (!activePage) {
                return <div>No active page found</div>
            }
            return <Page module={activePage} />
    }
}

export default Game
