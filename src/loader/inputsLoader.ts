import { loadJsonResource } from '@utils/loadJsonResource'
import type { VirtualKeys, VirtualInputs } from './data/inputs'
import {
    virtualKeysSchema,
    virtualInputsSchema,
    type VirtualKeys as SchemaVirtualKeys,
    type VirtualInputs as SchemaVirtualInputs
} from './schema/inputs'
import { mapVirtualInputs, mapVirtualKeys } from './mappers/input'

export interface IInputLoader {
    loadVirtualKeys(path: string): Promise<VirtualKeys>
    loadVirtualInputs(path: string): Promise<VirtualInputs>
    reset(): void
}

export class InputLoader implements IInputLoader {
    private basePath: string
    private virtualKeysCache: Map<string, VirtualKeys> = new Map()
    private virtualInputsCache: Map<string, VirtualInputs> = new Map()

    constructor(basePath: string) {
        this.basePath = basePath
    }

    public reset(): void {
        this.virtualKeysCache.clear()
        this.virtualInputsCache.clear()
    }

    public async loadVirtualKeys(path: string): Promise<VirtualKeys> {
        if (this.virtualKeysCache.has(path)) return this.virtualKeysCache.get(path)!
        const schemaData = await loadJsonResource<SchemaVirtualKeys>(`${this.basePath}/${path}`, virtualKeysSchema)
        const data = mapVirtualKeys(schemaData)
        this.virtualKeysCache.set(path, data)
        return data
    }

    public async loadVirtualInputs(path: string): Promise<VirtualInputs> {
        if (this.virtualInputsCache.has(path)) return this.virtualInputsCache.get(path)!
        const schemaData = await loadJsonResource<SchemaVirtualInputs>(`${this.basePath}/${path}`, virtualInputsSchema)
        const data = mapVirtualInputs(schemaData)
        this.virtualInputsCache.set(path, data)
        return data
    }
}

