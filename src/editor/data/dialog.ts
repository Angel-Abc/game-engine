export interface Dialog {
  text: string
}

export type Dialogs = Record<string, Dialog>

export function isDialog(value: unknown): value is Dialog {
  return typeof value === 'object' && value !== null && 'text' in (value as Record<string, unknown>)
}
