import { describe, it, expect } from 'vitest'
import { ScriptActionHandler } from '@engine/actions/scriptActionHandler'
import { HandlerRegistry } from '@engine/core/handlerRegistry'
import { GameEngine } from '@engine/core/gameEngine'
import { ScriptRunner } from '@engine/script/scriptRunner'
import type { EngineContext } from '@engine/core/engineContext'
import type { Message, CleanUp } from '@utils/types'
import type { Action, ScriptAction } from '@loader/data/action'

function createEngine() {
  const handlers: Record<string, ((msg: Message) => void)[]> = {}
  const messageBus = {
    registerMessageListener: (message: string, handler: (msg: Message) => void): CleanUp => {
      handlers[message] ??= []
      handlers[message].push(handler)
      return () => {
        const list = handlers[message]
        if (list) {
          const index = list.indexOf(handler)
          if (index >= 0) list.splice(index, 1)
        }
      }
    },
    postMessage: (message: Message) => {
      handlers[message.message]?.forEach(h => h(message))
    },
    registerNotificationMessage: () => {},
    shutDown: () => {}
  }
  const stateManager = { state: { data: {} } } as any
  const handlerRegistry = new HandlerRegistry()
  const engineContext: EngineContext = {
    messageBus: messageBus as any,
    stateManager,
    translationService: {} as any,
    inputManager: {} as any,
    outputManager: {} as any,
    scriptRunner: new ScriptRunner(),
    lifecycleManager: {} as any,
    handlerRegistry,
    stateController: { State: { value: 0 }, setIsLoading: () => {}, setIsRunning: () => {} } as any
  }
  const engine = new GameEngine(engineContext)
  handlerRegistry.registerActionHandler(new ScriptActionHandler())
  return { engine, handlerRegistry, messageBus }
}

describe('ScriptActionHandler', () => {
  it('provides triggering message and payload to script context', () => {
    const { engine, handlerRegistry, messageBus } = createEngine()
    let result: any = null
    messageBus.registerMessageListener('RESULT', msg => { result = msg.payload })
    const action: ScriptAction = {
      type: 'script',
      script: "context.postMessage({ message: 'RESULT', payload: { msg: context.triggerMessage, payload: context.triggerPayload } })"
    }
    messageBus.registerMessageListener('TRIGGER', msg => {
      handlerRegistry.executeAction(engine, action as Action, msg)
    })
    messageBus.postMessage({ message: 'TRIGGER', payload: { foo: 42 } })
    expect(result).toEqual({ msg: 'TRIGGER', payload: { foo: 42 } })
  })
})
