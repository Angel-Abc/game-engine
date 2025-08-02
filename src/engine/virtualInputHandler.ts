import type { VirtualInput, VirtualKey } from '@loader/data/inputs'
import { logDebug } from '@utils/logMessage'
import { VIRTUAL_INPUT_MESSAGE } from './messages'
import type { IGameEngine } from './gameEngine'

export interface IVirtualInputHandler {
    cleanup(): void
    load(): Promise<void>
}

export class VirtualInputHandler implements IVirtualInputHandler {
    private keydownEventHandler: (event: KeyboardEvent) => void
    private virtualKeys: Map<string, VirtualKey> = new Map<string, VirtualKey>()
    private virtualInputs: Map<string, VirtualInput> = new Map<string, VirtualInput>()
    private gameEngine: IGameEngine

    constructor(gameEngine: IGameEngine) {
        this.gameEngine = gameEngine
        this.keydownEventHandler = (event: KeyboardEvent) => { this.onKeydownEvent(event.code, event.altKey, event.ctrlKey, event.shiftKey) }
        if (typeof document !== 'undefined') {
            document.addEventListener('keydown', this.keydownEventHandler)
        }
    }

    public async load(): Promise<void> {
        this.virtualKeys.clear()
        for (const path of this.gameEngine.Loader.Game.virtualKeys) {
            const virtualKeys = await this.gameEngine.Loader.loadVirtualKeys(path)
            virtualKeys.forEach(virtualKey => {
                const key = this.createKey(virtualKey.keyCode, virtualKey.alt, virtualKey.ctrl, virtualKey.shift)
                this.virtualKeys.set(key, virtualKey)
            })
        }

        this.virtualInputs.clear()
        for (const path of this.gameEngine.Loader.Game.virtualInputs) {
            const virtualInputs = await this.gameEngine.Loader.loadVirtualInputs(path)
            virtualInputs.forEach(virtualInput => {
                virtualInput.virtualKeys.forEach(virtualKey => {
                    this.virtualInputs.set(virtualKey, virtualInput)
                })
            })
        }
    }

    private createKey(code: string, alt: boolean, ctrl: boolean, shift: boolean): string {
        return `${code}-${alt}-${ctrl}-${shift}`
    }

    private onKeydownEvent(code: string, alt: boolean, ctrl: boolean, shift: boolean) {
        const key = this.createKey(code, alt, ctrl, shift)
        const virtualKey = this.virtualKeys.get(key)
        if (virtualKey) {
            logDebug('Virtual key: {0}', virtualKey.virtualKey)
            const virtualInput = this.virtualInputs.get(virtualKey.virtualKey)
            if (virtualInput) {
                this.gameEngine.MessageBus.postMessage({
                    message: VIRTUAL_INPUT_MESSAGE,
                    payload: virtualInput.virtualInput
                })
            }
        } else {
            logDebug('No virtual key for: code {0}, alt {1}, ctrl {2}, shift {3}', code, alt, ctrl, shift)
        }
    }

    public cleanup(): void {
        if (typeof document !== 'undefined') {
            document.removeEventListener('keydown', this.keydownEventHandler)
        }
    }
}
