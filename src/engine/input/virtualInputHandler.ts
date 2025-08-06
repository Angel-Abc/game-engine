import type { VirtualInput, VirtualKey } from '@loader/data/inputs'
import { logDebug } from '@utils/logMessage'
import { VIRTUAL_INPUT_MESSAGE } from '../messages/messages'
import type { ILoader } from '@loader/loader'
import type { IMessageBus } from '@utils/messageBus'

export interface IVirtualInputHandler {
    initialize(): void
    cleanup(): void
    load(): Promise<void>
    getVirtualInput(virtualInput: string): VirtualInput | null
}

export type VirtualInputHandlerServices = {
    loader: ILoader
    messageBus: IMessageBus
}

export class VirtualInputHandler implements IVirtualInputHandler {
    private keydownEventHandler: (event: KeyboardEvent) => void
    private virtualKeys: Map<string, VirtualKey> = new Map<string, VirtualKey>()
    private virtualInputsByVirtualKey: Map<string, VirtualInput> = new Map<string, VirtualInput>()
    private virtualInputs: Map<string, VirtualInput> = new Map<string, VirtualInput>()
    private services: VirtualInputHandlerServices

    constructor(services: VirtualInputHandlerServices) {
        this.services = services
        this.keydownEventHandler = (event: KeyboardEvent) => { this.onKeydownEvent(event.code, event.altKey, event.ctrlKey, event.shiftKey) }
    }

    public initialize(): void {
        if (typeof document !== 'undefined') {
            document.addEventListener('keydown', this.keydownEventHandler)
        }
    }

    public async load(): Promise<void> {
        this.virtualKeys.clear()
        for (const path of this.services.loader.Game.virtualKeys) {
            const virtualKeys = await this.services.loader.loadVirtualKeys(path)
            virtualKeys.forEach(virtualKey => {
                const key = this.createKey(virtualKey.keyCode, virtualKey.alt, virtualKey.ctrl, virtualKey.shift)
                this.virtualKeys.set(key, virtualKey)
            })
        }

        this.virtualInputsByVirtualKey.clear()
        this.virtualInputs.clear()
        for (const path of this.services.loader.Game.virtualInputs) {
            const virtualInputs = await this.services.loader.loadVirtualInputs(path)
            virtualInputs.forEach(virtualInput => {
                this.virtualInputs.set(virtualInput.virtualInput, virtualInput)
                virtualInput.virtualKeys.forEach(virtualKey => {
                    this.virtualInputsByVirtualKey.set(virtualKey, virtualInput)
                })
            })
        }
    }

    public getVirtualInput(virtualInput: string): VirtualInput | null {
        return this.virtualInputs.get(virtualInput) ?? null
    }

    private createKey(code: string, alt: boolean, ctrl: boolean, shift: boolean): string {
        return `${code}-${alt}-${ctrl}-${shift}`
    }

    private onKeydownEvent(code: string, alt: boolean, ctrl: boolean, shift: boolean) {
        const key = this.createKey(code, alt, ctrl, shift)
        const virtualKey = this.virtualKeys.get(key)
        if (virtualKey) {
            logDebug('VirtualInputHandler', 'Virtual key: {0}', virtualKey.virtualKey)
            const virtualInput = this.virtualInputsByVirtualKey.get(virtualKey.virtualKey)
            if (virtualInput) {
                this.services.messageBus.postMessage({
                    message: VIRTUAL_INPUT_MESSAGE,
                    payload: virtualInput.virtualInput
                })
            }
        } else {
            logDebug('VirtualInputHandler', 'No virtual key for: code {0}, alt {1}, ctrl {2}, shift {3}', code, alt, ctrl, shift)
        }
    }

    public cleanup(): void {
        if (typeof document !== 'undefined') {
            document.removeEventListener('keydown', this.keydownEventHandler)
        }
    }
}
