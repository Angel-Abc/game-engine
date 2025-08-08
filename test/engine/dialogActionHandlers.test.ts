import { describe, it, expect } from 'vitest'
import { HandlerRegistry } from '@engine/core/handlerRegistry'
import { GameEngine } from '@engine/core/gameEngine'
import type { EngineContext } from '@engine/core/engineContext'
import { GotoDialogActionHandler } from '@engine/actions/gotoDialogActionHandler'
import { EndDialogActionHandler } from '@engine/actions/endDialogActionHandler'
import { DIALOG_SHOW_DIALOG } from '@engine/messages/messages'
import type { Message } from '@utils/types'
import type { GotoDialogAction, EndDialogAction } from '@loader/data/dialog'

function createEngine() {
  const posted: Message[] = []
  const messageBus = {
    registerMessageListener: () => () => {},
    postMessage: (msg: Message) => { posted.push(msg) },
    registerNotificationMessage: () => {},
    shutDown: () => {}
  }
  const stateManager = { state: { dialogs: { activeDialog: null, isModalDialog: false, dialogStates: {} } } } as any
  const handlerRegistry = new HandlerRegistry()
  const engineContext: EngineContext = {
    messageBus: messageBus as any,
    stateManager,
    translationService: {} as any,
    inputManager: {} as any,
    outputManager: {} as any,
    scriptRunner: {} as any,
    lifecycleManager: {} as any,
    handlerRegistry,
    stateController: { State: { value: 0 }, setIsLoading: () => {}, setIsRunning: () => {} } as any
  }
  const engine = new GameEngine(engineContext)
  return { engine, handlerRegistry, posted, stateManager }
}

describe('GotoDialogActionHandler', () => {
  it('posts DIALOG_SHOW_DIALOG with target', () => {
    const { engine, handlerRegistry, posted } = createEngine()
    handlerRegistry.registerActionHandler(new GotoDialogActionHandler())
    const action: GotoDialogAction = { type: 'goto', target: 'next-dialog' }
    handlerRegistry.executeAction(engine, action)
    expect(posted).toEqual([{ message: DIALOG_SHOW_DIALOG, payload: 'next-dialog' }])
  })
})

describe('EndDialogActionHandler', () => {
  it('clears dialog state', () => {
    const { engine, handlerRegistry, stateManager } = createEngine()
    stateManager.state.dialogs.activeDialog = 'foo'
    stateManager.state.dialogs.isModalDialog = true
    stateManager.state.dialogs.dialogStates.foo = { activeChoices: [{ id: 'c1', input: {} as any }] }
    handlerRegistry.registerActionHandler(new EndDialogActionHandler())
    const action: EndDialogAction = { type: 'end-dialog' }
    handlerRegistry.executeAction(engine, action)
    expect(stateManager.state.dialogs.activeDialog).toBeNull()
    expect(stateManager.state.dialogs.isModalDialog).toBe(false)
    expect(stateManager.state.dialogs.dialogStates.foo.activeChoices).toEqual([])
  })
})
