import { loadJsonResource } from '@utils/loadJsonResource'
import type { Handlers, Handler } from './data/handler'
import { handlersSchema, type handlers as SchemaHandlers, type Handler as SchemaHandler } from './schema/handler'
import type { Action as ActionData } from './data/action'
import type { Action } from './schema/action'
import { fatalError } from '@utils/logMessage'

export async function handlerLoader(basePath: string, path: string): Promise<Handlers> {
    const schemaData = await loadJsonResource<SchemaHandlers>(`${basePath}/${path}`, handlersSchema)
    return schemaData.map(getHandler)
}

function getHandler(handler: SchemaHandler): Handler {
    return {
        message: handler.message,
        action: getAction(handler.action)
    }
}

function getAction(action: Action): ActionData {
    switch (action.type) {
        case 'post-message':
            return {
                type: 'post-message',
                message: action.message,
                payload: action.payload
            }
        default:
            fatalError('Unsupported action type: {0}', action.type)
    }
}

