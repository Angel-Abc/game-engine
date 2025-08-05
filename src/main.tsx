import { createRoot } from 'react-dom/client'
import { logDebug } from '@utils/logMessage'
import { Loader, type ILoader } from '@loader/loader'
import { type IGameEngine } from '@engine/gameEngine'
import { GameEngineInitializer, type IEngineManagerFactory } from '@engine/gameEngineInitializer'
import { PostMessageActionHandler } from '@engine/actions/postMessageActionHandler'
import { ScriptActionHandler } from '@engine/actions/scriptActionHandler'
import { ScriptConditionResolver } from '@engine/conditions/scriptConditionResolver'
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
  createPageManager: (engine, messageBus, stateManager) => createPageManager(engine, messageBus, stateManager),
  createMapManager: (engine, stateManager) => createMapManager(engine, stateManager),
  createVirtualInputHandler: (engine) => createVirtualInputHandler(engine),
  createInputManager: (engine, stateManager) => createInputManager(engine, stateManager),
  createOutputManager: (engine) => createOutputManager(engine),
  createDialogManager: (engine) => createDialogManager(engine),
  createTranslationService: () => createTranslationService(),
  createScriptRunner: () => createScriptRunner()
}

const engine: IGameEngine = GameEngineInitializer.initialize(loader, factory, {
  actionHandlers: [new PostMessageActionHandler(), new ScriptActionHandler()],
  conditionResolvers: [new ScriptConditionResolver()]
})
await engine.start()

const root = document.getElementById('app')
if (root) {
  createRoot(root).render(<App engine={engine} />)
}

