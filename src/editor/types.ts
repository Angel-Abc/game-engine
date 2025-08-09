export interface GameData {
  title: string
  description?: string
  version?: string
  ['initial-data']?: Record<string, unknown>
  pages?: Record<string, unknown>
  maps?: Record<string, unknown>
  tiles?: Record<string, unknown>
  dialogs?: Record<string, unknown>
}
