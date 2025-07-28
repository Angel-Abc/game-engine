import { logDebug } from '@utils/logMessage'
import { useSyncExternalStore } from 'react'
import { GameEngineState, getGameEngine } from '../engine/gameEngine'

export const App: React.FC = (): React.JSX.Element => {
    const engine = getGameEngine()
    const engineState = useSyncExternalStore(engine.State.subscribe.bind(engine.State), () => engine.State.value)

    logDebug('Game component rendered with engine state: {0}', engineState)

    switch(engineState) {
      case GameEngineState.init:
        return (<div>Initializing game engine ...</div>)
      case GameEngineState.loading:
        return (<div>Loading game data ...</div>)
      case GameEngineState.running:
        return (<div>TODO</div>)
    }
}
