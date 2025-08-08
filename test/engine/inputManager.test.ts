import { describe, it, expect, vi } from 'vitest'
import { InputManager, type InputManagerServices } from '@engine/input/inputManager'
import { InputSourceTracker } from '@engine/input/inputSourceTracker'
import { InputMatrixBuilder } from '@engine/input/inputMatrixBuilder'
import { VIRTUAL_INPUT_MESSAGE } from '@engine/messages/messages'
import type { ContextData } from '@engine/core/context'
import type { Input } from '@loader/data/inputs'

function createInputManager(actionFn = vi.fn()) {
  const handlers: ((message: { message: string; payload: unknown }) => void)[] = []
  const messageBus = {
    registerMessageListener: vi.fn((_message: string, handler: (msg: { message: string; payload: unknown }) => void) => {
      handlers.push(handler)
      return () => {
        const index = handlers.indexOf(handler)
        if (index >= 0) handlers.splice(index, 1)
      }
    }),
    postMessage: (message: { message: string; payload: unknown }) => {
      handlers.forEach(h => h(message))
    }
  }

  const translationService = { translate: (s: string) => s }
  const virtualInputHandler = { getVirtualInput: () => ({ label: '' }) }

  const input: Input = {
    virtualInput: 'test',
    preferredRow: 0,
    preferredCol: 0,
    label: 'label',
    description: 'desc',
    visible: { type: 'script', script: '' },
    enabled: { type: 'script', script: '' },
    action: { type: 'script', script: '' }
  }

  const state: ContextData = {
    language: 'en',
    pages: {
      page1: { id: 'page1', screen: { type: 'grid', width: 1, height: 1, components: [] }, inputs: [input] }
    },
    maps: {},
    dialogSets: {},
    tiles: {},
    tileSets: {},
    dialogs: {
      activeDialog: null,
      isModalDialog: false,
      dialogSets: {}
    },
    data: {
      activePage: 'page1',
      location: { mapName: null, position: { x: 0, y: 0 }, mapSize: { width: 0, height: 0 } }
    }
  }
  const stateManager = { state } as any

  const inputSourceTracker = new InputSourceTracker({
    messageBus: messageBus as any,
    stateManager,
    resolveCondition: () => true
  })

  const inputMatrixBuilder = new InputMatrixBuilder({
    translationService: translationService as any,
    virtualInputHandler: virtualInputHandler as any
  })

  const services: InputManagerServices = {
    messageBus: messageBus as any,
    inputSourceTracker,
    inputMatrixBuilder,
    executeAction: actionFn as any
  }

  const inputManager = new InputManager(services)
  return { inputManager, messageBus, actionFn }
}

describe('InputManager', () => {
  it('does not invoke handlers after cleanup and reinitialize cycles', () => {
    const { inputManager, messageBus, actionFn } = createInputManager()

    inputManager.initialize()
    inputManager.update()

    inputManager.cleanup()
    messageBus.postMessage({ message: VIRTUAL_INPUT_MESSAGE, payload: 'test' })
    expect(actionFn).not.toHaveBeenCalled()

    inputManager.initialize()
    inputManager.update()
    messageBus.postMessage({ message: VIRTUAL_INPUT_MESSAGE, payload: 'test' })
    expect(actionFn).toHaveBeenCalledTimes(1)

    inputManager.cleanup()
    messageBus.postMessage({ message: VIRTUAL_INPUT_MESSAGE, payload: 'test' })
    expect(actionFn).toHaveBeenCalledTimes(1)
  })
})
