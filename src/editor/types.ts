import type { Page as LoaderPage } from '../loader/schema/page'
import { pageSchema } from '../loader/schema/page'

export interface GameData {
  title: string
  description?: string
  version?: string
  ['initial-data']?: {
    language?: string
    'start-page'?: string
  }
  pages?: Record<string, Page>
  maps?: Record<string, unknown>
  tiles?: Record<string, unknown>
  dialogs?: Record<string, unknown>
  languages?: Record<string, unknown>
}

export type Page = LoaderPage & { fileName?: string }
export { pageSchema as PageSchema }

export interface GameTreeSection {
  name: string
  items: string[]
}
