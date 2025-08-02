import { loadJsonResource } from '@utils/loadJsonResource'
import type { VirtualKeys, VirtualInputs } from './data/inputs'
import {
    virtualKeysSchema,
    virtualInputsSchema,
    type VirtualKeys as SchemaVirtualKeys,
    type VirtualInputs as SchemaVirtualInputs
} from './schema/inputs'
import { mapVirtualInputs, mapVirtualKeys } from './mappers/input'

export async function virtualKeysLoader(basePath: string, path: string): Promise<VirtualKeys> {
    const schemaData = await loadJsonResource<SchemaVirtualKeys>(`${basePath}/${path}`, virtualKeysSchema)
    return mapVirtualKeys(schemaData)
}

export async function virtualInputsLoader(basePath: string, path: string): Promise<VirtualInputs> {
    const schemaData = await loadJsonResource<SchemaVirtualInputs>(`${basePath}/${path}`, virtualInputsSchema)
    return mapVirtualInputs(schemaData)
}

