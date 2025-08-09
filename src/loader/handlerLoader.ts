import { loadJsonResource } from '@utils/loadJsonResource'
import type { Handlers } from './data/handler'
import { handlersSchema, type Handlers as SchemaHandlers } from './schema/handler'
import { mapHandlers } from './mappers/handler'

export async function handlerLoader(basePath: string, path: string): Promise<Handlers> {
    const schemaData = await loadJsonResource<SchemaHandlers>(`${basePath}/${path}`, handlersSchema)
    return mapHandlers(schemaData)
}
