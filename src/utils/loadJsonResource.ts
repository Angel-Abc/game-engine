import { ZodType } from 'zod'
import { fatalError, logDebug } from './logMessage'

export async function loadJsonResource<T>(url: string, schema: ZodType<T>): Promise<T> {
    logDebug('LoadJsonResource', 'Fetching JSON resource from {0}', url)
    let response: Response
    try {
        response = await fetch(url)
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        fatalError('LoadJsonResource', 'Failed to fetch {0} with message {1}', url, message)
    }

    if (!response.ok) {
        fatalError('LoadJsonResource', 'Failed to fetch resource {0} with response {1}', url, response)
    }

    let json: unknown
    try {
        json = await response.json()
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        fatalError('LoadJsonResource', 'Invalid JSON response: {0}', message)
    }

    const parseResult = schema.safeParse(json)
    if (!parseResult.success) {
        fatalError('LoadJsonResource', 'Schema validation failed for resource {0} with error {1}', url, parseResult.error.message)
    }

    logDebug('LoadJsonResource', 'Resulting object: {0}', parseResult.data)

    return parseResult.data
}
