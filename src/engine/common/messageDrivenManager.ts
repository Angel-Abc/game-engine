import { EventHandlerManager } from './eventHandlerManager'
import type { IMessageBus } from '@utils/messageBus'
import type { Message } from '@utils/types'

export abstract class MessageDrivenManager {
    private eventHandlerManager = new EventHandlerManager()

    protected registerMessageListener(
        messageBus: IMessageBus,
        message: string,
        handler: (message: Message) => void | Promise<void>
    ): void {
        this.eventHandlerManager.addListener(
            messageBus.registerMessageListener(message, handler)
        )
    }

    public cleanup(): void {
        this.eventHandlerManager.clearListeners()
    }
}

