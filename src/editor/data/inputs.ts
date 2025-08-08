export type VirtualKey = string
export type VirtualKeys = VirtualKey[]

export type VirtualInput = string
export type VirtualInputs = VirtualInput[]

export function isVirtualKey(value: unknown): value is VirtualKey {
  return typeof value === 'string'
}

export function isVirtualInput(value: unknown): value is VirtualInput {
  return typeof value === 'string'
}
