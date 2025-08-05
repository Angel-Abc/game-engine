import { createRoot } from 'react-dom/client'
import { logDebug } from '@utils/logMessage'
import { Loader, type ILoader } from '@loader/loader'
import { GameEngine, type IGameEngine, type IEngineManagerFactory } from '@engine/gameEngine'
import { PageManager } from '@engine/pageManager'
import { MapManager } from '@engine/mapManager'
import { VirtualInputHandler } from '@engine/virtualInputHandler'
import { InputManager } from '@engine/inputManager'
import { OutputManager } from '@engine/outputManager'
import { DialogManager } from '@engine/dialogManager'
import { ScriptRunner } from '@engine/scriptRunner'
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

const factory: IEngineManagerFactory = {
  createPageManager: (engine) => new PageManager(engine),
  createMapManager: (engine) => new MapManager(engine),
  createVirtualInputHandler: (engine) => new VirtualInputHandler(engine),
  createInputManager: (engine) => new InputManager(engine),
  createOutputManager: (engine) => new OutputManager(engine),
  createDialogManager: (engine) => new DialogManager(engine),
  createScriptRunner: () => new ScriptRunner()
}

const engine: IGameEngine = new GameEngine(loader, factory)
await engine.start()

const root = document.getElementById('app')
if (root) {
  createRoot(root).render(<App engine={engine} />)
}

