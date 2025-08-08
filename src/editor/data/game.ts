export interface InitialData {
  language: string
  startPage: string
}

export interface Game {
  title: string
  description: string
  version: string
  initialData: InitialData
  languages: Record<string, string[]>
  pages: Record<string, unknown>
  maps: Record<string, unknown>
  tiles: Record<string, string>
  dialogs: Record<string, string>
  handlers: string[]
  virtualKeys: string[]
  virtualInputs: string[]
}
