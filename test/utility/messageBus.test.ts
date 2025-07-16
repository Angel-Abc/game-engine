import { describe, it, expect, vi, afterEach } from 'vitest'

vi.mock('@utility/logMessage', () => ({
  logDebug: vi.fn(),
  logWarning: vi.fn(),
}))

import {
  initializeMessageBus,
  postMessage,
  registerMessageListener,
  registerNotificationMessage,
  disableEmptyQueueAfterPost,
  enableEmptyQueueAfterPost,
} from '@utility/messageBus'
import { logWarning, logDebug } from '@utility/logMessage'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('MessageBus', () => {
  it('delivers messages to registered listeners', () => {
    const onEmpty = vi.fn()
    initializeMessageBus(onEmpty)
    const handler = vi.fn()
    registerMessageListener('test', handler)

    const msg = { message: 'test', payload: 'payload' }
    postMessage(msg)

    expect(handler).toHaveBeenCalledWith(msg)
    expect(onEmpty).toHaveBeenCalled()
  })

  it('logs warning when no listener is registered', () => {
    const onEmpty = vi.fn()
    initializeMessageBus(onEmpty)

    const msg = { message: 'missing', payload: 'foo' }
    postMessage(msg)

    expect(logWarning).toHaveBeenCalled()
    expect(onEmpty).toHaveBeenCalled()
  })

  it('logs debug instead of warning for notification messages', () => {
    const onEmpty = vi.fn()
    initializeMessageBus(onEmpty)
    registerNotificationMessage('notify')

    const msg = { message: 'notify', payload: 'bar' }
    postMessage(msg)

    expect(logDebug).toHaveBeenCalled()
    expect(logWarning).not.toHaveBeenCalled()
    expect(onEmpty).toHaveBeenCalled()
  })

  it('processes queued messages when re-enabled', () => {
    const onEmpty = vi.fn()
    initializeMessageBus(onEmpty)
    const handler = vi.fn()
    registerMessageListener('queued', handler)

    disableEmptyQueueAfterPost()
    postMessage({ message: 'queued', payload: 42 })

    expect(handler).not.toHaveBeenCalled()
    expect(onEmpty).not.toHaveBeenCalled()

    enableEmptyQueueAfterPost()

    expect(handler).toHaveBeenCalledWith({ message: 'queued', payload: 42 })
    expect(onEmpty).toHaveBeenCalled()
  })
})
