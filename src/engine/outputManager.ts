import type { IGameEngine } from './gameEngine'
import { ADD_LINE_TO_OUTPUT_LOG, OUTPUT_LOG_LINE_ADDED } from './messages'

export interface IOutputManager {
    cleanup(): void
    getLastLines(maxCount: number): string[]
}

export class OutputManager implements IOutputManager {
    private gameEngine: IGameEngine
    private unregisterEventHandlers: (() => void)[] = []
    private outputLogLines: string[] = []
    private currentMaxSize: number = 0

    constructor(gameEngine: IGameEngine) {
        this.gameEngine = gameEngine
        this.unregisterEventHandlers.push(gameEngine.MessageBus.registerMessageListener(ADD_LINE_TO_OUTPUT_LOG, (message) => this.newLine(message.payload as string)))

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
        this.gameEngine.MessageBus.postMessage({
            message: OUTPUT_LOG_LINE_ADDED,
            payload: line
        })
    }
}