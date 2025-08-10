import type { IMessageBus } from '@utils/messageBus'
import type { IStateManager } from '../core/stateManager'
import type { ContextData } from '../core/context'
import type { Input } from '@loader/data/inputs'
import type { Condition } from '@loader/data/condition'
import { hasMapChanged, updateMap } from '@utils/map'
import { INPUTHANDLER_INPUTS_CHANGED } from '../messages/messages'
import { logDebug } from '@utils/logMessage'

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
    private inputs: Map<string, InputItem> = new Map()
    private previousInputs: Map<string, InputItem> = new Map()

    constructor(services: InputSourceTrackerServices) {
        this.services = services
    }

    public update(): void {
        this.loadInputs()
        this.recalculateInputConditions()
    }

    public getInput(virtualInput: string): InputItem | undefined {
        return this.inputs.get(virtualInput)
    }

    public getVisibleInputs(): InputItem[] {
        return Array.from(this.inputs.values()).filter(item => item.visible)
    }

    private loadInputs(): void {
        this.inputs = new Map<string, InputItem>([...this.loadPageInputs(), ...this.loadDialogInputs()])
        logDebug('InputSourceTracker', 'Loaded inputs: {0}', this.inputs)
    }

    private loadDialogInputs(): Map<string, InputItem> {
        const result = new Map<string, InputItem>()
        const context = this.services.stateManager.state
        const activeDialogSetId = context.dialogs.activeDialog
        if (!activeDialogSetId) return result
        const activeDialogSet = context.dialogSets[activeDialogSetId]
        if (!activeDialogSet) return result
        const dialogState = context.dialogs.dialogStates[activeDialogSetId]
        if (!dialogState) return result
        
        dialogState.activeChoices.forEach(choice => {
            result.set(choice.input.virtualInput, {
                input: choice.input,
                enabled: this.services.resolveCondition(choice.input.enabled ?? null),
                visible: this.services.resolveCondition(choice.input.visible ?? null)
            })
        })
        return result
    }

    private loadPageInputs(): Map<string, InputItem> {
        const result = new Map<string, InputItem>()
        const context = this.services.stateManager.state
        const activePage = context.data.activePage
        if (activePage === null) return result

        const page = this.services.stateManager.state.pages[activePage]
        page.inputs.forEach(input => {
            result.set(input.virtualInput, {
                input,
                enabled: this.services.resolveCondition(input.enabled ?? null),
                visible: this.services.resolveCondition(input.visible ?? null)
            })
        })
        return result
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
            this.previousInputs = new Map(this.inputs)
            this.services.messageBus.postMessage({
                message: INPUTHANDLER_INPUTS_CHANGED,
                payload: {}
            })
        }
    }
}

