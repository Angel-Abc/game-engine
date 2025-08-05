import { createRoot } from 'react-dom/client'
import { logDebug } from '@utils/logMessage'
import { Loader, type ILoader } from '@loader/loader'
import { GameEngine, type IGameEngine, type IEngineManagerFactory } from '@engine/gameEngine'
import { createPageManager } from '@engine/pageManagerService'
import { createMapManager } from '@engine/mapManagerService'
import { createVirtualInputHandler } from '@engine/virtualInputHandlerService'
import { createInputManager } from '@engine/inputManagerService'
import { createOutputManager } from '@engine/outputManagerService'
import { createDialogManager } from '@engine/dialogManagerService'
import { createScriptRunner } from '@engine/scriptRunnerFactory'
import { createTranslationService } from '@engine/translationServiceFactory'
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
  createPageManager: (engine) => createPageManager(engine),
  createMapManager: (engine) => createMapManager(engine),
  createVirtualInputHandler: (engine) => createVirtualInputHandler(engine),
  createInputManager: (engine) => createInputManager(engine),
  createOutputManager: (engine) => createOutputManager(engine),
  createDialogManager: (engine) => createDialogManager(engine),
  createTranslationService: () => createTranslationService(),
  createScriptRunner: () => createScriptRunner()
}

const engine: IGameEngine = new GameEngine(loader, factory)
await engine.start()

const root = document.getElementById('app')
if (root) {
  createRoot(root).render(<App engine={engine} />)
}

