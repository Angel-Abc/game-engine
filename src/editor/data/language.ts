export type Language = string[]
export type Languages = Record<string, Language>

export function isLanguage(value: unknown): value is Language {
  return Array.isArray(value) && value.every((line) => typeof line === 'string')
}
