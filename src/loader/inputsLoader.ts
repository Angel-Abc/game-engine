import { loadJsonResource } from '@utils/loadJsonResource'
import type { VirtualKey, VirtualKeys, VirtualInput, VirtualInputs } from './data/inputs'
import {
    virtualKeysSchema,
    virtualInputsSchema,
    type VirtualKeys as SchemaVirtualKeys,
    type VirtualInputs as SchemaVirtualInputs
} from './schema/inputs'

function getVirtualKey(key: SchemaVirtualKeys[number]): VirtualKey {
    return {
        virtualKey: key.virtualKey,
        keyCode: key.keyCode,
        shift: key.shift ?? false,
        ctrl: key.ctrl ?? false,
        alt: key.alt ?? false
    }
}

function getVirtualInput(input: SchemaVirtualInputs[number]): VirtualInput {
    return {
        virtualInput: input.virtualInput,
        virtualKeys: [...input.virtualKeys],
        label: input.label
    }
}

export async function virtualKeysLoader(basePath: string, path: string): Promise<VirtualKeys> {
    const schemaData = await loadJsonResource<SchemaVirtualKeys>(`${basePath}/${path}`, virtualKeysSchema)
    return schemaData.map(getVirtualKey)
}

export async function virtualInputsLoader(basePath: string, path: string): Promise<VirtualInputs> {
    const schemaData = await loadJsonResource<SchemaVirtualInputs>(`${basePath}/${path}`, virtualInputsSchema)
    return schemaData.map(getVirtualInput)
}

