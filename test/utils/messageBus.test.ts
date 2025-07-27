import { describe, it, expect, vi } from 'vitest'
import { MessageBus } from '@utils/messageBus'

describe('MessageBus', () => {
  it('delivers messages to listeners and empties the queue', () => {
    const onEmpty = vi.fn()
    const bus = new MessageBus(onEmpty)
    const handler = vi.fn()
    bus.registerMessageListener('hello', handler)

    bus.postMessage({ message: 'hello', payload: 42 })

    expect(handler).toHaveBeenCalledWith({ message: 'hello', payload: 42 })
    expect(onEmpty).toHaveBeenCalled()
  })

  it('processes queued messages after re-enabling automatic emptying', () => {
    const onEmpty = vi.fn()
    const bus = new MessageBus(onEmpty)
    const handler = vi.fn()
    bus.registerMessageListener('test', handler)

    bus.disableEmptyQueueAfterPost()
    bus.postMessage({ message: 'test', payload: null })
    expect(handler).not.toHaveBeenCalled()
    expect(onEmpty).not.toHaveBeenCalled()

    bus.enableEmptyQueueAfterPost()

    expect(handler).toHaveBeenCalledTimes(1)
    expect(onEmpty).toHaveBeenCalledTimes(1)
  })

  it('awaits async listeners before processing next message', async () => {
    const onEmpty = vi.fn()
    const bus = new MessageBus(onEmpty)
    const results: string[] = []

    bus.registerMessageListener('first', async () => {
      await Promise.resolve()
      results.push('first')
    })

    bus.registerMessageListener('second', () => {
      results.push('second')
    })

    bus.postMessage({ message: 'first', payload: null })
    bus.postMessage({ message: 'second', payload: null })

    // allow queued promises to resolve
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(results).toEqual(['first', 'second'])
    expect(onEmpty).toHaveBeenCalledTimes(1)
  })
})
