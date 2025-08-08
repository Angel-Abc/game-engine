import type { Languages } from './language'
import type { Pages } from './page'
import type { Maps } from './map'
import type { Tiles } from './tile'
import type { Dialogs } from './dialog'
import type { Handlers } from './handler'
import type { VirtualKeys, VirtualInputs } from './inputs'

export interface InitialData {
  language: string
  startPage: string
}

export interface Game {
  title: string
  description: string
  version: string
  initialData: InitialData
  languages: Languages
  pages: Pages
  maps: Maps
  tiles: Tiles
  dialogs: Dialogs
  handlers: Handlers
  virtualKeys: VirtualKeys
  virtualInputs: VirtualInputs
}
