import { loadJsonResource } from '@utils/loadJsonResource'
import type { Handlers } from './data/handler'
import { handlersSchema, type Handlers as SchemaHandlers } from './schema/handler'
import { mapHandlers } from './mappers/handler'

export interface IHandlerLoader {
    loadHandlers(path: string): Promise<Handlers>
    reset(): void
}

export class HandlerLoader implements IHandlerLoader {
    private basePath: string
    private cache: Map<string, Handlers> = new Map()

    constructor(basePath: string) {
        this.basePath = basePath
    }

    public reset(): void {
        this.cache.clear()
    }

    public async loadHandlers(path: string): Promise<Handlers> {
        if (this.cache.has(path)) return this.cache.get(path)!
        const schemaData = await loadJsonResource<SchemaHandlers>(`${this.basePath}/${path}`, handlersSchema)
        const handlers = mapHandlers(schemaData)
        this.cache.set(path, handlers)
        return handlers
    }
}

