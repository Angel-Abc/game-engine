export type Handler = string
export type Handlers = Handler[]

export function isHandler(value: unknown): value is Handler {
  return typeof value === 'string'
}
