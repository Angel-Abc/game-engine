import { useEffect, useState, useSyncExternalStore } from 'react'
import { GameEngineState } from '@engine/core/gameEngine'
import { PAGE_SWITCHED_MESSAGE } from '@engine/messages/messages'
import type { Page as PageData } from '@loader/data/page'
import { Page } from './controls/page'
import { useGameEngine } from './engineContext'
import { useMessageBus } from './messageBusContext'
import { useStateManager } from './stateManagerContext'

export const App: React.FC = (): React.JSX.Element => {
  const engine = useGameEngine()
  const messageBus = useMessageBus()
  const stateManager = useStateManager()
  const engineState = useSyncExternalStore(engine.State.subscribe.bind(engine.State), () => engine.State.value)
  const [activePage, setActivePage] = useState<string | null>(stateManager.state.data.activePage)
  useEffect(() => {
    const cleanup = messageBus.registerMessageListener(PAGE_SWITCHED_MESSAGE, () => {
      setActivePage(stateManager.state.data.activePage)
    })
    return cleanup
  }, [messageBus, stateManager])
  const page: PageData | null = activePage !== null ? stateManager.state.pages[activePage] : null

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
