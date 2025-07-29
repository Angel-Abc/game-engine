import { useEffect, useState, useSyncExternalStore } from 'react'
import { GameEngineState, getGameEngine } from '@engine/gameEngine'
import { PAGE_SWITCHED_MESSAGE } from '@engine/messages'
import type { Page as PageData } from '@loader/data/page'
import { Page } from './controls/page'

export const App: React.FC = (): React.JSX.Element => {
  const engine = getGameEngine()
  const engineState = useSyncExternalStore(engine.State.subscribe.bind(engine.State), () => engine.State.value)
  const [activePage, setActivePage] = useState<string | null>(engine.StateManager.state.data.activePage)
  useEffect(() => {
    const cleanup = engine.MessageBus.registerMessageListener(PAGE_SWITCHED_MESSAGE, () => {
      setActivePage(engine.StateManager.state.data.activePage)
    })
    return cleanup
  }, [engine])
  const page: PageData | null = activePage !== null ? engine.StateManager.state.pages[activePage] : null

  switch (engineState) {
    case GameEngineState.init:
      return (<div>Initializing game engine ...</div>)
    case GameEngineState.loading:
      return (<div>Loading game data ...</div>)
    case GameEngineState.running:
      return (
        <Page page={page} />
      )
  }
}
