import { ZodType } from 'zod'

export async function loadJsonResource<T>(url: string, schema: ZodType<T>): Promise<T> {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to fetch resource: ${response.status} ${response.statusText}`)
  }

  let json: unknown
  try {
    json = await response.json()
  } catch (err) {
    throw new Error(`Invalid JSON response: ${err}`)
  }

  const parseResult = schema.safeParse(json)
  if (!parseResult.success) {
    console.error(parseResult.error)
    throw new Error(`Schema validation failed`)
  }

  return parseResult.data
}
