import { describe, it, expect, vi } from 'vitest'
import { VirtualInputHandler, type VirtualInputHandlerServices } from '@engine/input/virtualInputHandler'
import { TestKeyboardEventTarget } from '@engine/input/keyboardEventTarget'
import { VIRTUAL_INPUT_MESSAGE } from '@engine/messages/messages'

function createHandler() {
  const keyboard = new TestKeyboardEventTarget()
  const services: VirtualInputHandlerServices = {
    gameLoader: { Game: { virtualKeys: ['vk'], virtualInputs: ['vi'] } } as any,
    inputLoader: {
      loadVirtualKeys: vi.fn().mockResolvedValue([
        { keyCode: 'KeyA', alt: false, ctrl: false, shift: false, virtualKey: 'VK_A' }
      ]),
      loadVirtualInputs: vi.fn().mockResolvedValue([
        { virtualInput: 'CONFIRM', virtualKeys: ['VK_A'] }
      ])
    } as any,
    messageBus: { postMessage: vi.fn() } as any,
    keyboardEventTarget: keyboard
  }
  const handler = new VirtualInputHandler(services)
  return { handler, services, keyboard }
}

describe('VirtualInputHandler', () => {
  it('dispatches messages when mapped keys are pressed', async () => {
    const { handler, services, keyboard } = createHandler()
    handler.initialize()
    await handler.load()
    keyboard.dispatch({
      type: 'keydown',
      code: 'KeyA',
      altKey: false,
      ctrlKey: false,
      shiftKey: false
    } as KeyboardEvent & { type: 'keydown' })

    expect(services.messageBus.postMessage).toHaveBeenCalledWith({
      message: VIRTUAL_INPUT_MESSAGE,
      payload: 'CONFIRM'
    })

    handler.cleanup()
    expect(keyboard.listenerCount('keydown')).toBe(0)
  })
})
