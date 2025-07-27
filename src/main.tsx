import { createRoot } from 'react-dom/client'
import './style.css'
import App from './app/app'
import { logDebug } from '@utils/logMessage'
import { Loader, type ILoader } from './loader/loader'
import { GameEngine, type IGameEngine } from './engine/gameEngine'

logDebug('Application starting ...')

const loader: ILoader = new Loader()
await loader.loadRoot()
const engine: IGameEngine = new GameEngine(loader)
await engine.start()

const root = document.getElementById('app')
if (root) {
  createRoot(root).render(<App />)
}

