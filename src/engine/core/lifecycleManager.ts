import { fatalError } from '@utils/logMessage'
import type { IMessageBus } from '@utils/messageBus'
import { SWITCH_PAGE_MESSAGE, END_TURN_MESSAGE, ENGINE_STATE_CHANGED_MESSAGE, MAP_SWITCHED_MESSAGE } from '../messages/messages'
import type { IGameLoader, IHandlerLoader } from '@loader/loader'
import type { ILanguageLoader } from '@loader/languageLoader'
import type { IStateManager } from './stateManager'
import type { ContextData } from './context'
import type { ITranslationService } from '../dialog/translationService'
import type { IPageManager } from '../page/pageManager'
import type { IMapManager } from '../map/mapManager'
import type { IVirtualInputHandler } from '../input/virtualInputHandler'
import type { IInputManager } from '../input/inputManager'
import type { IOutputManager } from '../output/outputManager'
import type { IDialogManager } from '../dialog/dialogManager'
import type { IHandlerRegistry } from './handlerRegistry'
import { GameEngineState } from './stateController'
import type { IStateController } from './stateController'
import type { IGameEngine } from './gameEngine'

export interface ILifecycleManager {
    start(engine: IGameEngine): Promise<void>
    cleanup(): void
}

export class LifecycleManager implements ILifecycleManager {
    private gameLoader: IGameLoader
    private languageLoader: ILanguageLoader
    private handlerLoader: IHandlerLoader
    private messageBus: IMessageBus
    private stateManager: IStateManager<ContextData>
    private translationService: ITranslationService
    private pageManager: IPageManager
    private mapManager: IMapManager
    private virtualInputHandler: IVirtualInputHandler
    private inputManager: IInputManager
    private outputManager: IOutputManager
    private dialogManager: IDialogManager
    private handlerRegistry: IHandlerRegistry
    private stateController: IStateController
    private currentLanguage: string | null = null

    constructor(deps: {
        gameLoader: IGameLoader
        languageLoader: ILanguageLoader
        handlerLoader: IHandlerLoader
        messageBus: IMessageBus
        stateManager: IStateManager<ContextData>
        translationService: ITranslationService
        pageManager: IPageManager
        mapManager: IMapManager
        virtualInputHandler: IVirtualInputHandler
        inputManager: IInputManager
        outputManager: IOutputManager
        dialogManager: IDialogManager
        handlerRegistry: IHandlerRegistry
        stateController: IStateController
    }) {
        this.gameLoader = deps.gameLoader
        this.languageLoader = deps.languageLoader
        this.handlerLoader = deps.handlerLoader
        this.messageBus = deps.messageBus
        this.stateManager = deps.stateManager
        this.translationService = deps.translationService
        this.pageManager = deps.pageManager
        this.mapManager = deps.mapManager
        this.virtualInputHandler = deps.virtualInputHandler
        this.inputManager = deps.inputManager
        this.outputManager = deps.outputManager
        this.dialogManager = deps.dialogManager
        this.handlerRegistry = deps.handlerRegistry
        this.stateController = deps.stateController
        this.initializeMessageListeners()
    }

    public async start(engine: IGameEngine): Promise<void> {
        this.stateController.State.value = GameEngineState.loading
        await this.gameLoader.reset()
        await this.handlerRegistry.registerGameHandlers(engine, this.gameLoader, this.handlerLoader, this.messageBus)
        await this.virtualInputHandler.load()
        const language = (this.currentLanguage ?? this.stateManager.state.language) ?? fatalError('LifecycleManager', 'No language set!')
        this.currentLanguage = language
        this.translationService.setLanguage(await this.languageLoader.loadLanguage(language))
        this.stateController.State.value = GameEngineState.running
        this.messageBus.postMessage({
            message: SWITCH_PAGE_MESSAGE,
            payload: this.gameLoader.Game.initialData.startPage
        })
    }

    public cleanup(): void {
        this.pageManager.cleanup()
        this.mapManager.cleanup()
        this.virtualInputHandler.cleanup()
        this.inputManager.cleanup()
        this.outputManager.cleanup()
        this.dialogManager.cleanup()
        this.handlerRegistry.cleanup()
    }

    private initializeMessageListeners(): void {
        this.messageBus.registerNotificationMessage(END_TURN_MESSAGE)
        this.messageBus.registerNotificationMessage(ENGINE_STATE_CHANGED_MESSAGE)
        this.messageBus.registerNotificationMessage(MAP_SWITCHED_MESSAGE)
    }
}
