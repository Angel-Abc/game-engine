import { loadJsonResource } from '@utils/loadJsonResource'
import { gameSchema, type Game } from './schema/game'
import { languageSchema, type Language } from './schema/language'
import { fatalError, logDebug } from '@utils/logMessage'
import { type Game as GameData } from './data/game'
import { type Language as LanguageData } from './data/language'
import { type Page as PageData } from './data/page'
import { pageLoader } from './pageLoader'
import type { Handlers } from './data/handler'
import { handlerLoader } from './handlerLoader'
import type { TileSet as TileSetData } from './data/tile'
import { tileLoader } from './tileLoader'
import type { GameMap as MapData } from './data/map'
import { mapLoader } from './mapLoader'

export interface ILoader {
    loadPage(page: string): Promise<PageData>
    loadRoot(): Promise<void>
    reset(): Promise<void>
    get Game(): GameData
    get Styling(): string[]
    loadLanguage(language: string): Promise<LanguageData>
    loadHandlers(path: string): Promise<Handlers>
    loadTileSet(id: string): Promise<TileSetData>
    loadMap(id: string): Promise<MapData>
}

export class Loader implements ILoader {
    private basePath: string
    private game: GameData | null = null
    private styling: string[] = []
    private root: Game | null = null
    private languages: Map<string, LanguageData> = new Map()
    private pages: Map<string, PageData> = new Map()
    private handlers: Map<string, Handlers> = new Map()
    private tileSets: Map<string, TileSetData> = new Map()
    private maps: Map<string, MapData> = new Map()

    constructor(basePath: string = '/data') {
        this.basePath = basePath
    }

    public async loadRoot(): Promise<void> {
        await this.reset()
        logDebug('Root loaded: {0}', this.root)
    }

    public async reset(): Promise<void> {
        this.languages.clear()
        this.pages.clear()
        this.handlers.clear()
        this.tileSets.clear()
        this.maps.clear()
        this.root = await loadJsonResource(`${this.basePath}/index.json`, gameSchema)
        this.styling = this.root.styling.map(css => `${this.basePath}/${css}`)
        this.game = {
            title: this.root.title,
            description: this.root.description,
            version: this.root.version,
            initialData: {
                language: this.root['initial-data'].language,
                startPage: this.root['initial-data']['start-page']
            },
            languages: this.root.languages,
            pages: this.root.pages,
            maps: this.root.maps,
            tiles: this.root.tiles,
            handlers: this.root.handlers,
            virtualKeys: this.root['virtual-keys'],
            virtualInputs: this.root['virtual-inputs']
        }
    }

    public async loadLanguage(language: string): Promise<LanguageData> {
        if (this.languages.has(language)) return this.languages.get(language)!
        const path = this.game?.languages[language]
        if (!path) fatalError('Language {0} was not found!', language)
        const schemaData = await loadJsonResource<Language>(`${this.basePath}/${path}`, languageSchema)
        const result: LanguageData = {
            id: schemaData.id,
            translations: { ...schemaData.translations }
        }
        this.languages.set(language, result)
        return result
    }

    public async loadPage(page: string): Promise<PageData> {
        if (this.pages.has(page)) return this.pages.get(page)!
        const path = this.game?.pages[page] ?? fatalError('Unknown page: {0}', page)
        return pageLoader({basePath: this.basePath, path}, result => this.pages.set(page, result))
    }

    public async loadTileSet(id: string): Promise<TileSetData> {
        if (this.tileSets.has(id)) return this.tileSets.get(id)!
        const path = this.game?.tiles[id] ?? fatalError('Unknown tile set: {0}', id)
        const tileSet = await tileLoader({ basePath: this.basePath, path })
        this.tileSets.set(id, tileSet)
        return tileSet
    }

    public async loadMap(id: string): Promise<MapData> {
        if (this.maps.has(id)) return this.maps.get(id)!
        const path = this.game?.maps[id] ?? fatalError('Unknown map: {0}', id)
        const map = await mapLoader({ basePath: this.basePath, path })
        this.maps.set(id, map)
        return map
    }

    public async loadHandlers(path: string): Promise<Handlers> {
        if (this.handlers.has(path)) return this.handlers.get(path)!
        const handlers = await handlerLoader(this.basePath, path)
        this.handlers.set(path, handlers)
        return handlers
    }

    public get Game(): GameData {
        if (this.game) return this.game
        fatalError('No game root loaded yet')
    }

    public get Styling(): string[] {
        return this.styling
    }
}
