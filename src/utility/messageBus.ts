import { logDebug, logWarning } from './logMessage'
import { type CleanUp, type IMessageBus, type Message } from './types'

type MessageListener = {
    key: number
    message: string
    handler: (message: Message) => void
}

export class MessageBus implements IMessageBus {
    private key: number = 0
    private queue: Message[] = []
    private listeners: Map<string, MessageListener[]> = new Map<string, MessageListener[]>()
    private emptyingQueue: boolean = false
    private emptyQueueAfterPost: number = 0
    private onQueueEmpty: () => void


    constructor(onQueueEmpty: () => void) {
        this.onQueueEmpty = onQueueEmpty
    }

    postMessage(message: Message): void {
        logDebug('Push message: {0}', message)
        this.queue.push(message)
        logDebug('EmptyQueueAfterPost: {0}', this.emptyQueueAfterPost)
        if (this.emptyQueueAfterPost === 0) {
            this.emptyQueue()
        }
    }

    public disableEmptyQueueAfterPost(): void {
        this.emptyQueueAfterPost = this.emptyQueueAfterPost + 1
    }

    public enableEmptyQueueAfterPost(): void {
        this.emptyQueueAfterPost = Math.max(0, this.emptyQueueAfterPost - 1)
        this.emptyQueue()
    }

    public registerMessageListener(message: string, handler: (message: Message) => void): CleanUp {
        if (!this.listeners.has(message)) {
            this.listeners.set(message, [])
        }
        const listener: MessageListener = {
            key: this.key++,
            message: message,
            handler: handler
        }
        this.listeners.get(message)!.push(listener)

        // return the unregister function
        return () => {
            if (this.listeners.has(message)) {
                this.listeners.set(message, this.listeners.get(message)!.filter(l => l.key !== listener.key))
            }
        }
    }

    private handleFirstMessage() {
        if (this.queue.length === 0) return
        const message = this.queue.shift()
        if (!message) return
        const listeners = this.listeners.get(message.message)
        if (!listeners) {
            logWarning('No message listener for message: {0}', message)
            return
        }
        listeners.forEach(listener => listener.handler(message))
    }

    public emptyQueue(): void {
        if (this.emptyingQueue || this.queue.length === 0) return
        this.emptyingQueue = true
        try {
            while (this.queue.length > 0)
                this.handleFirstMessage()
        } finally {
            this.emptyingQueue = false
        }
        this.onQueueEmpty()
    }
}