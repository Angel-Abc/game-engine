import { ZodType } from 'zod'
import { logDebug } from '@utility/logMessage.ts'

export async function loadJsonResource<T>(url: string, schema: ZodType<T>): Promise<T> {
  logDebug('Fetching JSON resource from {0}', url)
  const response = await fetch(url)

  logDebug('Received response: {0} {1}', response.status, response.statusText)

  if (!response.ok) {
    throw new Error(`Failed to fetch resource: ${response.status} ${response.statusText}`)
  }

  let json: unknown
  try {
    json = await response.json()
    logDebug('JSON parsed successfully')
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    throw new Error(`Invalid JSON response: ${message}`)
  }

  logDebug('Validating JSON schema')
  const parseResult = schema.safeParse(json)
  if (!parseResult.success) {
    console.error(parseResult.error)
    throw new Error(`Schema validation failed`)
  }

  logDebug('Schema validation succeeded')

  logDebug('Resulting object: {0}', parseResult.data)

  return parseResult.data
}
