import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@styling/index.css'
import { logDebug } from '@utility/logMessage'
import { loadGameData } from '@loader/index'
import type { GameData } from '@data/game/game'
import App from '@app/game'
import { GameEngine } from '@engine/gameEngine'

logDebug('Application starting...')

const game: GameData = await loadGameData()
logDebug('Game loaded: {0}', game)
for (const css of game.css) {
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = css
  document.head.appendChild(link)
}
const gameEngine = new GameEngine(game)
window.addEventListener('beforeunload', () => gameEngine.cleanup())

const root = createRoot(document.body)
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
)

gameEngine.start()
