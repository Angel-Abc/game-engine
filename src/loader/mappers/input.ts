import type { Input as InputData } from '@loader/data/inputs'
import { type Input } from '@loader/schema/inputs'
import { mapCondition } from './condition'
import { mapAction } from './action'

export function mapInputs(inputs: Input[]): InputData[] {
    return inputs.map(mapInput)
}

export function mapInput(input: Input): InputData {
    return {
        virtualInput: input.vitualInput,
        preferredRow: input.prefferedRow,
        preferredCol: input.prefferedCol,
        label: input.label,
        description: input.description,
        visible: mapCondition(input.visible),
        enabled: mapCondition(input.enabled),
        action: mapAction(input.action)
    }
}