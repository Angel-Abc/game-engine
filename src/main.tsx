import { createRoot } from 'react-dom/client'
import './style.css'
import { logDebug } from '@utils/logMessage'
import { Loader, type ILoader } from './loader/loader'
import { GameEngine, type IGameEngine } from './engine/gameEngine'
import { App } from './app/app'

logDebug('Application starting ...')

const loader: ILoader = new Loader()
await loader.loadRoot()
const engine: IGameEngine = new GameEngine(loader)
await engine.start()

const root = document.getElementById('app')
if (root) {
  createRoot(root).render(<App />)
}

