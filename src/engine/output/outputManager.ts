import type { IMessageBus } from '@utils/messageBus'
import { ADD_LINE_TO_OUTPUT_LOG, FINALIZE_END_TURN_MESSAGE, OUTPUT_LOG_LINE_ADDED } from '../messages/messages'
import { EventHandlerManager } from '@engine/common/eventHandlerManager'

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
    private eventHandlerManager = new EventHandlerManager()
    private outputLogLines: string[] = []
    private currentMaxSize: number = 0
    private needsNewDayLine: boolean = false

    constructor(services: OutputManagerServices) {
        this.services = services
    }

    public initialize(): void {
        this.eventHandlerManager.addListener(
            this.services.messageBus.registerMessageListener(
                ADD_LINE_TO_OUTPUT_LOG,
                (message) => this.addLine(message.payload as string)
            )
        )
        this.eventHandlerManager.addListener(
            this.services.messageBus.registerMessageListener(
                FINALIZE_END_TURN_MESSAGE,
                () => { this.needsNewDayLine = true }
            )
        )
    }

    public cleanup(): void {
        this.eventHandlerManager.clearListeners()
        this.outputLogLines = []
    }

    public getLastLines(maxCount: number): string[] {
        if (maxCount > this.currentMaxSize) this.currentMaxSize = maxCount + 1
        return this.outputLogLines.slice(-1 * maxCount)
    }

    private addLine(line: string): void {
        if (this.needsNewDayLine) {
            this.outputLogLines.push('<hr/>')
            this.needsNewDayLine = false
        }
        this.outputLogLines.push(line)
        if (this.currentMaxSize > 0 && this.outputLogLines.length > 2 * this.currentMaxSize) {
            this.outputLogLines = this.outputLogLines.slice(-1 * this.currentMaxSize)
        }
        this.services.messageBus.postMessage({
            message: OUTPUT_LOG_LINE_ADDED,
            payload: line
        })
    }
}
