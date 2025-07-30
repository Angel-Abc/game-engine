import { loadJsonResource } from '@utils/loadJsonResource'
import { gameSchema, type Game } from './schema/game'
import { languageSchema, type Language } from './schema/language'
import { fatalError, logDebug } from '@utils/logMessage'
import { type Game as GameData } from './data/game'
import { type Language as LanguageData } from './data/language'
import { type Page as PageData } from './data/page'
import { pageLoader } from './pageLoader'
import type { Handlers } from './data/handler'

export interface ILoader {
    loadPage(page: string): Promise<PageData>
    loadRoot(): Promise<void>
    reset(): Promise<void>
    get Game(): GameData
    get Styling(): string[]
    loadLanguage(language: string): Promise<LanguageData>
}

export class Loader implements ILoader {
    private basePath: string
    private game: GameData | null = null
    private styling: string[] = []
    private root: Game | null = null
    private languages: Map<string, LanguageData> = new Map()
    private pages: Map<string, PageData> = new Map()

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
            handlers: this.root.handlers
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
        return pageLoader(this.basePath, path, result => this.pages.set(page, result))
    }

    public get Game(): GameData {
        if (this.game) return this.game
        fatalError('No game root loaded yet')
    }

    public get Styling(): string[] {
        return this.styling
    }
}