import { createRoot } from 'react-dom/client'
import { logDebug } from '@utils/logMessage'
import { Loader, type ILoader } from '@loader/loader'
import { type IGameEngine } from '@engine/core/gameEngine'
import { GameEngineInitializer, type IEngineManagerFactory } from '@engine/core/gameEngineInitializer'
import { PostMessageActionHandler } from '@engine/actions/postMessageActionHandler'
import { ScriptActionHandler } from '@engine/actions/scriptActionHandler'
import { ScriptConditionResolver } from '@engine/conditions/scriptConditionResolver'
import { createPageManager } from '@engine/page/pageManagerService'
import { createMapManager } from '@engine/map/mapManagerService'
import { createVirtualInputHandler } from '@engine/input/virtualInputHandlerService'
import { createInputManager } from '@engine/input/inputManagerService'
import { createOutputManager } from '@engine/output/outputManagerService'
import { createDialogManager } from '@engine/dialog/dialogManagerService'
import { createScriptRunner } from '@engine/script/scriptRunnerFactory'
import { createTranslationService } from '@engine/dialog/translationServiceFactory'
import { App } from '@app/app'
import './style/reset.css'
import './style/variables.css'
import './style/game.css'

logDebug('Main', 'Application starting ...')

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
  createMapManager: (engine, messageBus, stateManager) => createMapManager(engine, messageBus, stateManager),
  createVirtualInputHandler: (engine, messageBus) => createVirtualInputHandler(engine, messageBus),
  createInputManager: (engine, messageBus, stateManager, translationService, virtualInputHandler) =>
    createInputManager(engine, messageBus, stateManager, translationService, virtualInputHandler),
  createOutputManager: (engine, messageBus) => createOutputManager(engine, messageBus),
  createDialogManager: (engine, messageBus, stateManager) => createDialogManager(engine, messageBus, stateManager),
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

