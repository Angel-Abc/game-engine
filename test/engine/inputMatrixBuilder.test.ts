import { describe, it, expect } from 'vitest'
import { performance } from 'node:perf_hooks'
import { InputMatrixBuilder, nullMatrixInputItem, type MatrixInputItem } from '@engine/input/inputMatrixBuilder'
import type { InputItem } from '@engine/input/inputSourceTracker'
import type { Input } from '@loader/data/inputs'
import { create2DArray } from '@utils/array'

function buildMatrixNaive(width: number, height: number, inputs: InputItem[]): MatrixInputItem[][] {
  const matrix: MatrixInputItem[][] = create2DArray<MatrixInputItem>(height, width, nullMatrixInputItem)
  const itemsToProcess: InputItem[] = [...inputs]

  const getMatrixInputItem = (inputItem: InputItem): MatrixInputItem => ({
    enabled: inputItem.enabled,
    label: inputItem.input.label,
    description: inputItem.input.description,
    virtualInput: inputItem.input.virtualInput,
    character: ''
  })

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let found = false
      for (let index = itemsToProcess.length - 1; index >= 0 && !found; index--) {
        const inputItem = itemsToProcess[index]
        if (inputItem.input.preferredCol === x && inputItem.input.preferredRow === y) {
          found = true
          matrix[y][x] = getMatrixInputItem(inputItem)
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
        matrix[y][x] = getMatrixInputItem(itemsToProcess.shift()!)
      }
    }
  }

  return matrix
}

describe('InputMatrixBuilder', () => {
  it('builds faster than naive implementation for large input sets', () => {
    const translationService = { translate: (s: string) => s }
    const virtualInputHandler = { getVirtualInput: () => ({ label: '' }) }
    const builder = new InputMatrixBuilder({ translationService, virtualInputHandler } as any)

    const width = 30
    const height = 30
    const totalInputs = width * height * 10
    const inputs: InputItem[] = []

    for (let i = 0; i < totalInputs; i++) {
      const input: Input = {
        virtualInput: `v${i}`,
        preferredRow: i < width * height ? Math.floor(i / width) : undefined,
        preferredCol: i < width * height ? i % width : undefined,
        label: 'l',
        description: 'd',
        visible: { type: 'script', script: '' },
        enabled: { type: 'script', script: '' },
        action: { type: 'script', script: '' }
      }
      inputs.push({ input, enabled: true, visible: true })
    }

    const startNaive = performance.now()
    const matrixNaive = buildMatrixNaive(width, height, inputs)
    const naiveTime = performance.now() - startNaive

    const startOpt = performance.now()
    const matrixOpt = builder.build(width, height, inputs)
    const optTime = performance.now() - startOpt

    expect(matrixOpt).toEqual(matrixNaive)
    expect(optTime).toBeLessThan(naiveTime)
  })
})
