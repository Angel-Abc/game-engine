import { create2DArray } from '@utils/array'
import type { ITranslationService } from '../dialog/translationService'
import type { IVirtualInputHandler } from './virtualInputHandler'
import type { InputItem } from './inputSourceTracker'

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

export type InputMatrixBuilderServices = {
    translationService: ITranslationService
    virtualInputHandler: IVirtualInputHandler
}

export class InputMatrixBuilder {
    private services: InputMatrixBuilderServices

    constructor(services: InputMatrixBuilderServices) {
        this.services = services
    }

    public build(width: number, height: number, inputs: InputItem[]): MatrixInputItem[][] {
        const matrix: MatrixInputItem[][] = create2DArray<MatrixInputItem>(height, width, nullMatrixInputItem)
        const itemsToProcess: InputItem[] = [...inputs]

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let found = false
                for (let index = itemsToProcess.length - 1; index >= 0 && !found; index--) {
                    const inputItem = itemsToProcess[index]
                    if (inputItem.input.preferredCol === x && inputItem.input.preferredRow === y) {
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

        for (let y = height - 1; y >= 0 && itemsToProcess.length > 0; y--) {
            for (let x = width - 1; x >= 0 && itemsToProcess.length > 0; x--) {
                if (matrix[y][x] === nullMatrixInputItem) {
                    matrix[y][x] = this.getMatrixInputItem(itemsToProcess.shift()!)
                }
            }
        }

        return matrix
    }

    private getMatrixInputItem(inputItem: InputItem): MatrixInputItem {
        return {
            enabled: inputItem.enabled,
            label: this.services.translationService.translate(inputItem.input.label),
            description: this.services.translationService.translate(inputItem.input.description),
            virtualInput: inputItem.input.virtualInput,
            character: this.services.virtualInputHandler.getVirtualInput(inputItem.input.virtualInput)?.label ?? ''
        }
    }
}

