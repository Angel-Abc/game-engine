import { describe, it, expect, vi, afterEach } from 'vitest'

vi.mock('@utility/logMessage', () => ({
  logDebug: vi.fn(),
  logWarning: vi.fn(),
}))

import { MessageBus } from '@utility/messageBus'
import { logWarning, logDebug } from '@utility/logMessage'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('MessageBus', () => {
  it('delivers messages to registered listeners', () => {
    const onEmpty = vi.fn()
    const bus = new MessageBus(onEmpty)
    const handler = vi.fn()
    bus.registerMessageListener('test', handler)

    const msg = { message: 'test', payload: 'payload' }
    bus.postMessage(msg)

    expect(handler).toHaveBeenCalledWith(msg)
    expect(onEmpty).toHaveBeenCalled()
  })

  it('logs warning when no listener is registered', () => {
    const onEmpty = vi.fn()
    const bus = new MessageBus(onEmpty)

    const msg = { message: 'missing', payload: 'foo' }
    bus.postMessage(msg)

    expect(logWarning).toHaveBeenCalled()
    expect(onEmpty).toHaveBeenCalled()
  })

  it('logs debug instead of warning for notification messages', () => {
    const onEmpty = vi.fn()
    const bus = new MessageBus(onEmpty)
    bus.registerNotificationMessage('notify')

    const msg = { message: 'notify', payload: 'bar' }
    bus.postMessage(msg)

    expect(logDebug).toHaveBeenCalled()
    expect(logWarning).not.toHaveBeenCalled()
    expect(onEmpty).toHaveBeenCalled()
  })

  it('processes queued messages when re-enabled', () => {
    const onEmpty = vi.fn()
    const bus = new MessageBus(onEmpty)
    const handler = vi.fn()
    bus.registerMessageListener('queued', handler)

    bus.disableEmptyQueueAfterPost()
    bus.postMessage({ message: 'queued', payload: 42 })

    expect(handler).not.toHaveBeenCalled()
    expect(onEmpty).not.toHaveBeenCalled()

    bus.enableEmptyQueueAfterPost()

    expect(handler).toHaveBeenCalledWith({ message: 'queued', payload: 42 })
    expect(onEmpty).toHaveBeenCalled()
  })
})
