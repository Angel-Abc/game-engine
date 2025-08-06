import type { IMessageBus } from '@utils/messageBus'
import type { IStateManager } from '../core/stateManager'
import type { ContextData } from '../core/context'
import type { Input } from '@loader/data/inputs'
import type { Condition } from '@loader/data/condition'
import { hasMapChanged, updateMap } from '@utils/map'
import { INPUTHANDLER_INPUTS_CHANGED } from '../messages/messages'

export type InputItem = {
    input: Input
    enabled: boolean
    visible: boolean
}

export type InputSourceTrackerServices = {
    messageBus: IMessageBus
    stateManager: IStateManager<ContextData>
    resolveCondition: (condition: Condition | null) => boolean
}

export class InputSourceTracker {
    private services: InputSourceTrackerServices
    private currentPage: string | null = null
    private inputs: Map<string, InputItem> = new Map()
    private previousInputs: Map<string, InputItem> = new Map()

    constructor(services: InputSourceTrackerServices) {
        this.services = services
    }

    public update(): void {
        if (!this.loadInputs()) {
            this.recalculateInputConditions()
        }
    }

    public getInput(virtualInput: string): InputItem | undefined {
        return this.inputs.get(virtualInput)
    }

    public getVisibleInputs(): InputItem[] {
        return Array.from(this.inputs.values()).filter(item => item.visible)
    }

    private loadInputs(): boolean {
        const activePage = this.services.stateManager.state.data.activePage
        if (this.currentPage === activePage) {
            return false
        }
        this.inputs.clear()
        this.currentPage = activePage
        if (activePage === null) {
            return false
        }
        const page = this.services.stateManager.state.pages[activePage]
        page.inputs.forEach(input => {
            this.inputs.set(input.virtualInput, {
                input,
                enabled: this.services.resolveCondition(input.enabled ?? null),
                visible: this.services.resolveCondition(input.visible ?? null)
            })
        })
        return true
    }

    private recalculateInputConditions(): void {
        this.inputs.forEach(inputItem => {
            const input = inputItem.input
            inputItem.enabled = this.services.resolveCondition(input.enabled ?? null)
            inputItem.visible = this.services.resolveCondition(input.visible ?? null)
        })

        if (hasMapChanged(
            this.previousInputs,
            this.inputs,
            (a, b) => a.input.virtualInput === b.input.virtualInput && a.enabled === b.enabled && a.visible === b.visible
        )) {
            updateMap(this.previousInputs, this.inputs, item => ({ ...item }))
            this.services.messageBus.postMessage({
                message: INPUTHANDLER_INPUTS_CHANGED,
                payload: {}
            })
        }
    }
}

