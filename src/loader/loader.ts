import { loadJsonResource } from '@utils/loadJsonResource'
import { gameSchema, type Game } from './schema/game'
import { fatalError, logDebug } from '@utils/logMessage'
import { type Game as GameData } from './data/game'
import type { Language as LanguageData } from './data/language'
import type { Page as PageData } from './data/page'
import { pageLoader, type IPageLoader } from './pageLoader'
import type { Handlers } from './data/handler'
import { handlerLoader } from './handlerLoader'
import type { TileSet as TileSetData } from './data/tile'
import { tileLoader, type ITileLoader } from './tileLoader'
import type { GameMap as MapData } from './data/map'
import { mapLoader, type IMapLoader } from './mapLoader'
import type { VirtualKeys as VirtualKeysData, VirtualInputs as VirtualInputsData } from './data/inputs'
import { virtualKeysLoader, virtualInputsLoader, type IInputLoader } from './inputsLoader'
import { mapGame } from './mappers/game'
import type { DialogSet } from './data/dialog'
import { dialogLoader, type IDialogLoader } from './dialogLoader'
import { languageLoader, type ILanguageLoader } from './languageLoader'

export type { IPageLoader } from './pageLoader'
export type { ITileLoader } from './tileLoader'
export type { IMapLoader } from './mapLoader'
export type { IDialogLoader } from './dialogLoader'
export type { IInputLoader } from './inputsLoader'
export type { ILanguageLoader } from './languageLoader'

export interface IGameLoader {
    loadRoot(): Promise<void>
    reset(): Promise<void>
    readonly Game: GameData
    readonly Styling: string[]
}

export interface IHandlerLoader {
    loadHandlers(path: string): Promise<Handlers>
}

export type ILoader = IGameLoader & IPageLoader & ITileLoader & IMapLoader & IDialogLoader & IInputLoader & ILanguageLoader & IHandlerLoader

export class Loader implements ILoader {
    private basePath: string
    private game: GameData | null = null
    private styling: string[] = []
    private root: Game | null = null
    private languages: Map<string, LanguageData> = new Map()
    private pages: Map<string, PageData> = new Map()
    private handlers: Map<string, Handlers> = new Map()
    private tileSets: Map<string, TileSetData> = new Map()
    private dialogs: Map<string, DialogSet> = new Map()
    private maps: Map<string, MapData> = new Map()
    private virtualKeys: Map<string, VirtualKeysData> = new Map()
    private virtualInputs: Map<string, VirtualInputsData> = new Map()

    constructor(basePath: string = '/data') {
        this.basePath = basePath
    }

    private async loadWithCache<T>(cache: Map<string, T>, key: string, loader: () => Promise<T>): Promise<T> {
        if (cache.has(key)) return cache.get(key)!
        const result = await loader()
        cache.set(key, result)
        return result
    }

    public async loadRoot(): Promise<void> {
        await this.reset()
        logDebug('Loader', 'Root loaded: {0}', this.root)
    }

    public async reset(): Promise<void> {
        this.languages.clear()
        this.pages.clear()
        this.handlers.clear()
        this.tileSets.clear()
        this.maps.clear()
        this.virtualKeys.clear()
        this.virtualInputs.clear()
        this.root = await loadJsonResource(`${this.basePath}/index.json`, gameSchema)
        const { game, styling } = mapGame(this.root, this.basePath)
        this.game = game
        this.styling = styling
    }

    public async loadLanguage(language: string): Promise<LanguageData> {
        return this.loadWithCache(this.languages, language, async () => {
            const paths = this.game?.languages[language]
            if (!paths) fatalError('Loader', 'Language {0} was not found!', language)
            return languageLoader(this.basePath, paths)
        })
    }

    public async loadPage(page: string): Promise<PageData> {
        return this.loadWithCache(this.pages, page, async () => {
            const path = this.game?.pages[page] ?? fatalError('Loader', 'Unknown page: {0}', page)
            return pageLoader({ basePath: this.basePath, path })
        })
    }

    public async loadTileSet(id: string): Promise<TileSetData> {
        return this.loadWithCache(this.tileSets, id, async () => {
            const path = this.game?.tiles[id] ?? fatalError('Loader', 'Unknown tile set: {0}', id)
            return tileLoader({ basePath: this.basePath, path })
        })
    }

    public async loadMap(id: string): Promise<MapData> {
        return this.loadWithCache(this.maps, id, async () => {
            const path = this.game?.maps[id] ?? fatalError('Loader', 'Unknown map: {0}', id)
            return mapLoader({ basePath: this.basePath, path })
        })
    }

    public async loadDialog(id: string): Promise<DialogSet> {
        return this.loadWithCache(this.dialogs, id, async () => {
            const path = this.game?.dialogs[id] ?? fatalError('Loader', 'Unknown dialog: {0}', id)
            return dialogLoader({ basePath: this.basePath, path })
        })
    }

    public async loadHandlers(path: string): Promise<Handlers> {
        return this.loadWithCache(this.handlers, path, () => handlerLoader(this.basePath, path))
    }

    public async loadVirtualKeys(path: string): Promise<VirtualKeysData> {
        return this.loadWithCache(this.virtualKeys, path, () => virtualKeysLoader(this.basePath, path))
    }

    public async loadVirtualInputs(path: string): Promise<VirtualInputsData> {
        return this.loadWithCache(this.virtualInputs, path, () => virtualInputsLoader(this.basePath, path))
    }

    public get Game(): GameData {
        if (this.game) return this.game
        fatalError('Loader', 'No game root loaded yet')
    }

    public get Styling(): string[] {
        return this.styling
    }
}
