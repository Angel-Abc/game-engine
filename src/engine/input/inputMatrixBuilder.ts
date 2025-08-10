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
        const preferredIndex = new Map<string, InputItem>()
        const itemsToProcess: InputItem[] = []

        for (const item of inputs) {
            const { preferredRow, preferredCol } = item.input
            if (
                preferredRow !== undefined &&
                preferredCol !== undefined &&
                preferredRow >= 0 && preferredRow < height &&
                preferredCol >= 0 && preferredCol < width
            ) {
                const key = `${preferredCol},${preferredRow}`
                const existing = preferredIndex.get(key)
                if (existing) itemsToProcess.push(existing)
                preferredIndex.set(key, item)
            } else {
                itemsToProcess.push(item)
            }
        }

        let fallbackIndex = 0
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const key = `${x},${y}`
                const indexedItem = preferredIndex.get(key)
                if (indexedItem) {
                    matrix[y][x] = this.getMatrixInputItem(indexedItem)
                } else if (fallbackIndex < itemsToProcess.length) {
                    matrix[y][x] = this.getMatrixInputItem(itemsToProcess[fallbackIndex++])
                } else {
                    matrix[y][x] = nullMatrixInputItem
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

