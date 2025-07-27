import { createRoot } from 'react-dom/client'
import './style.css'
import App from './app/app'
import { logDebug } from '@utils/logMessage'
import { Loader, type ILoader } from './loader/loader'
import { GameEngine, type IGameEngine } from './engine/gameEngine'

logDebug('Application starting ...')

const loader: ILoader = new Loader()
await loader.loadRoot()
logDebug('Loaded game = {0}', loader.Game)
const engine: IGameEngine = new GameEngine(loader)
engine.start()

const root = document.getElementById('app')
if (root) {
  createRoot(root).render(<App />)
}

