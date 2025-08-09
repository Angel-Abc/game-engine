export interface GameData {
  title: string
  description?: string
  version?: string
  ['initial-data']?: {
    language?: string
    'start-page'?: string
  }
  pages?: Record<string, unknown>
  maps?: Record<string, unknown>
  tiles?: Record<string, unknown>
  dialogs?: Record<string, unknown>
  languages?: Record<string, unknown>
}

export interface GameTreeSection {
  name: string
  items: string[]
}
