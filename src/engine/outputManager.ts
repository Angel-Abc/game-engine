import type { IMessageBus } from '@utils/messageBus'
import { ADD_LINE_TO_OUTPUT_LOG, OUTPUT_LOG_LINE_ADDED } from './messages'

export interface IOutputManager {
    initialize(): void
    cleanup(): void
    getLastLines(maxCount: number): string[]
}

export type OutputManagerServices = {
    messageBus: IMessageBus
}

export class OutputManager implements IOutputManager {
    private services: OutputManagerServices
    private unregisterEventHandlers: (() => void)[] = []
    private outputLogLines: string[] = []
    private currentMaxSize: number = 0

    constructor(services: OutputManagerServices) {
        this.services = services
    }

    public initialize(): void {
        this.unregisterEventHandlers.push(
            this.services.messageBus.registerMessageListener(
                ADD_LINE_TO_OUTPUT_LOG,
                (message) => this.newLine(message.payload as string)
            )
        )
    }

    public cleanup(): void {
        this.unregisterEventHandlers.forEach(unregister => unregister())
        this.outputLogLines = []
    }

    public getLastLines(maxCount: number): string[] {
        if (maxCount > this.currentMaxSize) this.currentMaxSize = maxCount + 1
        return this.outputLogLines.slice(-1 * maxCount)
    }

    private async newLine(line: string): Promise<void> {
        this.outputLogLines.push(line)
        if (this.currentMaxSize > 0 && this.outputLogLines.length > 2 * this.currentMaxSize){
            this.outputLogLines = this.outputLogLines.slice(-1 * this.currentMaxSize)
        }
        this.services.messageBus.postMessage({
            message: OUTPUT_LOG_LINE_ADDED,
            payload: line
        })
    }
}