import { logDebug, logWarning } from './logMessage'
import { type CleanUp, type Message } from './types'

type MessageListener = {
    key: number
    message: string
    handler: (message: Message) => void
}

let key = 0
let queue: Message[] = []
const listeners: Map<string, MessageListener[]> = new Map()
const silentMessages: Set<string> = new Set()
let emptyingQueue = false
let emptyQueueAfterPost = 0
let onQueueEmpty: () => void = () => {}

export function initializeMessageBus(callback: () => void): void {
    key = 0
    queue = []
    listeners.clear()
    silentMessages.clear()
    emptyingQueue = false
    emptyQueueAfterPost = 0
    onQueueEmpty = callback
}

export function postMessage(message: Message): void {
    logDebug('Push message: {0}', message)
    queue.push(message)
    logDebug('EmptyQueueAfterPost: {0}', emptyQueueAfterPost)
    if (emptyQueueAfterPost === 0) {
        emptyQueue()
    }
}

export function disableEmptyQueueAfterPost(): void {
    emptyQueueAfterPost = emptyQueueAfterPost + 1
}

export function enableEmptyQueueAfterPost(): void {
    emptyQueueAfterPost = Math.max(0, emptyQueueAfterPost - 1)
    emptyQueue()
}

export function registerNotificationMessage(message: string): void {
    silentMessages.add(message)
}

export function registerMessageListener(message: string, handler: (message: Message) => void): CleanUp {
    if (!listeners.has(message)) {
        listeners.set(message, [])
    }
    const listener: MessageListener = {
        key: key++,
        message,
        handler,
    }
    listeners.get(message)!.push(listener)

    return () => {
        if (listeners.has(message)) {
            listeners.set(
                message,
                listeners.get(message)!.filter((l) => l.key !== listener.key),
            )
        }
    }
}

function handleFirstMessage() {
    if (queue.length === 0) return
    const message = queue.shift()
    if (!message) return
    const handlers = listeners.get(message.message)
    if (!handlers || handlers.length === 0) {
        const logger = silentMessages.has(message.message) ? logDebug : logWarning
        logger('No message listener for message: {0}', message)
        return
    }
    handlers.forEach((listener) => listener.handler(message))
}

export function emptyQueue(): void {
    if (emptyingQueue || queue.length === 0) return
    emptyingQueue = true
    try {
        while (queue.length > 0) handleFirstMessage()
    } finally {
        emptyingQueue = false
    }
    onQueueEmpty()
}
