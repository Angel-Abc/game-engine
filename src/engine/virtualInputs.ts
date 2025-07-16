import type { VirtualKey, VirtualInput } from '@data/game/virtualInput'
import { logDebug } from '@utility/logMessage'
import type { IMessageBus } from '@utility/types'
import { VIRTUAL_INPUT_MESSAGE } from './messages'

export class VirtualInputHandler {
    private keydownEventHandler: (event: KeyboardEvent) => void
    private virtualKeys: Map<string, VirtualKey> = new Map<string, VirtualKey>()
    private virtualInputs: Map<string, VirtualInput> = new Map<string, VirtualInput>()
    private messageBus: IMessageBus

    constructor(messageBus: IMessageBus, virtualKeys: Map<string, VirtualKey>, virtualInputs: Map<string, VirtualInput>){
        this.messageBus = messageBus
        virtualKeys.forEach(virtualKey => {
            const key = this.createKey(virtualKey.keyCode, virtualKey.alt, virtualKey.ctrl, virtualKey.shift)
            this.virtualKeys.set(key, virtualKey)
        })
        virtualInputs.forEach(virtualInput => {
            virtualInput.virtualKeys.forEach(virtualKey => {
                this.virtualInputs.set(virtualKey.virtualKey, virtualInput)
            })
        })
        this.keydownEventHandler = (event: KeyboardEvent) => { this.onKeydownEvent(event.code, event.altKey, event.ctrlKey, event.shiftKey) }
        document.addEventListener('keydown', this.keydownEventHandler)
    }

    private createKey(code: string, alt: boolean, ctrl: boolean, shift: boolean): string {
        return `${code}-${alt}-${ctrl}-${shift}`
    }
    
    private onKeydownEvent(code: string, alt: boolean, ctrl: boolean, shift: boolean) {
        logDebug('Keyboard: code {0}, alt {1}, ctrl {2}, shift {3}', code, alt, ctrl, shift)
        const key = this.createKey(code, alt, ctrl, shift)
        const virtualKey = this.virtualKeys.get(key)
        if (virtualKey) {
            logDebug('Virtual key: {0}', virtualKey.virtualKey)
            const virtualInput = this.virtualInputs.get(virtualKey.virtualKey)
            if (virtualInput) {
                this.messageBus.postMessage({
                    message: VIRTUAL_INPUT_MESSAGE,
                    payload: virtualInput.virtualInput
                })
            }
        }
    }

    public cleanup(): void {
        document.removeEventListener('keydown', this.keydownEventHandler)
    }
}