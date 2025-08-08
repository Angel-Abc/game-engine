import { createRoot } from 'react-dom/client'
import { logDebug } from '@utils/logMessage'
import { Loader } from '@loader/loader'
import { type IGameEngine } from '@engine/core/gameEngine'
import { GameEngineInitializer, type IEngineManagerFactory } from '@engine/core/gameEngineInitializer'
import { PostMessageActionHandler } from '@engine/actions/postMessageActionHandler'
import { ScriptActionHandler } from '@engine/actions/scriptActionHandler'
import { GotoDialogActionHandler } from '@engine/actions/gotoDialogActionHandler'
import { EndDialogActionHandler } from '@engine/actions/endDialogActionHandler'
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

const loader = new Loader()
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
  createPageManager: (messageBus, stateManager, pageLoader, setIsLoading, setIsRunning) =>
    createPageManager(messageBus, stateManager, pageLoader, setIsLoading, setIsRunning),
  createMapManager: (messageBus, stateManager, mapLoader, tileLoader, translationService, executeAction, setIsLoading, setIsRunning) =>
    createMapManager(messageBus, stateManager, mapLoader, tileLoader, translationService, executeAction, setIsLoading, setIsRunning),
  createVirtualInputHandler: (gameLoader, inputLoader, messageBus) =>
    createVirtualInputHandler(gameLoader, inputLoader, messageBus),
  createInputManager: (messageBus, stateManager, translationService, virtualInputHandler, executeAction, resolveCondition) =>
    createInputManager(messageBus, stateManager, translationService, virtualInputHandler, executeAction, resolveCondition),
  createOutputManager: (messageBus) => createOutputManager(messageBus),
  createDialogManager: (messageBus, stateManager, translationService, dialogLoader, setIsLoading, setIsRunning, resolveCondition) =>
    createDialogManager(messageBus, stateManager, translationService, dialogLoader, setIsLoading, setIsRunning, resolveCondition),
  createTranslationService: () => createTranslationService(),
  createScriptRunner: () => createScriptRunner()
}

const engine: IGameEngine = GameEngineInitializer.initialize(loader, factory, {
  actionHandlers: [
    new PostMessageActionHandler(),
    new ScriptActionHandler(),
    new GotoDialogActionHandler(),
    new EndDialogActionHandler()
  ],
  conditionResolvers: [new ScriptConditionResolver()]
})
await engine.start()

const root = document.getElementById('app')
if (root) {
  createRoot(root).render(<App engine={engine} />)
}

