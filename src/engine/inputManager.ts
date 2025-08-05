import { create2DArray } from '@utils/array'
import type { IMessageBus } from '@utils/messageBus'
import type { ITranslationService } from './translationService'
import type { IVirtualInputHandler } from './virtualInputHandler'
import type { IStateManager } from './stateManager'
import type { ContextData } from './context'
import { INPUTHANDLER_INPUTS_CHANGED, VIRTUAL_INPUT_MESSAGE } from './messages'
import type { Input } from '@loader/data/inputs'
import { hasMapChanged, updateMap } from '@utils/map'
import type { Condition } from '@loader/data/condition'
import type { Action } from '@loader/data/action'

export type MatrixInputItem = {
    enabled: boolean
    label: string
    description: string
    virtualInput: string
    character: string
}

export const nullMatrixInputItem: MatrixInputItem = {
    enabled: false,
    label: '',
    description: '',
    virtualInput: '',
    character: ''
}

export interface IInputManager {
    initialize(): void
    cleanup(): void
    update(): void
    getInputMatrix(width: number, height: number): MatrixInputItem[][]
}

type InputItem = {
    input: Input
    enabled: boolean
    visible: boolean
}

export type InputManagerServices = {
    messageBus: IMessageBus
    translationService: ITranslationService
    virtualInputHandler: IVirtualInputHandler
    stateManager: IStateManager<ContextData>
    resolveCondition: (condition: Condition | null) => boolean
    executeAction: (action: Action) => void
}

export class InputManager implements IInputManager {
    private unregisterEventHandlers: (() => void)[] = []
    private services: InputManagerServices
    private currentPage: string | null = null
    private inputs: Map<string, InputItem> = new Map()
    private previousInputs: Map<string, InputItem> = new Map()

    constructor(services: InputManagerServices) {
        this.services = services
    }

    public initialize(): void {
        this.unregisterEventHandlers.push(
            this.services.messageBus.registerMessageListener(
                VIRTUAL_INPUT_MESSAGE,
                (message) => this.onInput(message.payload as string)
            )
        )
    }

    public cleanup(): void {
        this.unregisterEventHandlers.forEach(unregister => unregister())
    }

    public update(): void {
        if (!this.checkSources()) {
            this.recalculateInputConditions()
        }
    }

    public getInputMatrix(width: number, height: number): MatrixInputItem[][] {
        const matrix: MatrixInputItem[][] = create2DArray<MatrixInputItem>(height, width, nullMatrixInputItem)
        const itemsToProcess: InputItem[] = Array.from(this.inputs.values()).filter(item => item.visible)

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let found = false
                for (let index = itemsToProcess.length-1; index >= 0 && !found; index--) {
                    const inputItem = itemsToProcess[index]
                    if (inputItem.input.preferredCol === x && inputItem.input.preferredRow === y){
                        found = true
                        matrix[y][x] = this.getMatrixInputItem(inputItem)
                        itemsToProcess.splice(index, 1)
                    }
                }
                if (!found) {
                    matrix[y][x] = nullMatrixInputItem
                }
            }
        }

        for (let y=height - 1; y >= 0 && itemsToProcess.length > 0; y--) {
            for (let x=width -1 ; x >=0 && itemsToProcess.length > 0; x--){
                if (matrix[y][x] === nullMatrixInputItem) {
                    matrix[y][x] = this.getMatrixInputItem(itemsToProcess.shift()!)
                }
            }
        }

        return matrix
    }

    private getMatrixInputItem(inputItem: InputItem): MatrixInputItem {
        const matrixItem: MatrixInputItem = {
            enabled: inputItem.enabled,
            label: this.services.translationService.translate(inputItem.input.label),
            description: this.services.translationService.translate(inputItem.input.description),
            virtualInput: inputItem.input.virtualInput,
            character: this.services.virtualInputHandler.getVirtualInput(inputItem.input.virtualInput)?.label ?? ''
        }
        return matrixItem
    }

    private recalculateInputConditions(): void {
        this.inputs.forEach((inputItem) => {
            const input = inputItem.input
            inputItem.enabled = this.services.resolveCondition(input.enabled ?? null)
            inputItem.visible = this.services.resolveCondition(input.visible ?? null)
        })

        if (hasMapChanged(this.previousInputs, this.inputs,
            (a,b) => a.input.virtualInput === b.input.virtualInput && a.enabled === b.enabled && a.visible == b.visible)) {
                updateMap(this.previousInputs, this.inputs, item => ({ ...item }))
                this.services.messageBus.postMessage({
                    message: INPUTHANDLER_INPUTS_CHANGED,
                    payload: {}
                })
            }
    }

    private checkSources(): boolean {
        if (this.currentPage === this.services.stateManager.state.data.activePage) {
            return false
        }
        this.inputs.clear()
        this.currentPage = this.services.stateManager.state.data.activePage
        if (this.currentPage === null) {
            return false
        }
        const page = this.services.stateManager.state.pages[this.currentPage]
        page.inputs.forEach(input => {
            this.inputs.set(input.virtualInput, {
                input,
                enabled: this.services.resolveCondition(input.enabled ?? null),
                visible: this.services.resolveCondition(input.visible ?? null)
            })
        })
        return true
    }

    private onInput(input: string): void {
        const inputItem = this.inputs.get(input)
        if (inputItem && inputItem.enabled && inputItem.input.action) {
            this.services.executeAction(inputItem.input.action)
        }
    }
}

