import { createRoot } from 'react-dom/client'
import { logDebug } from '@utils/logMessage'
import { Loader, type ILoader } from '@loader/loader'
import { GameEngine, type IGameEngine } from '@engine/gameEngine'
import { App } from '@app/app'
import './style/reset.css'
import './style/variables.css'
import './style/game.css'

logDebug('Application starting ...')

const loader: ILoader = new Loader()
await loader.loadRoot()

// add css files to the header
// this is only done once
loader.Styling.forEach(css => {
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = css
  document.head.appendChild(link)
})

const engine: IGameEngine = new GameEngine(loader)
await engine.start()

const root = document.getElementById('app')
if (root) {
  createRoot(root).render(<App />)
}

