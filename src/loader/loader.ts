import { loadJsonResource } from '@utils/loadJsonResource'
import { gameSchema, type Game } from './schema/game'
import { languageSchema, type Language } from './schema/language'   
import { fatalError, logDebug } from '@utils/logMessage'
import { type Game as GameData } from './data/game'
import { type Language as LanguageData } from './data/language'

export interface ILoader {
    loadRoot(): Promise<void>
    reset(): Promise<void>
    get Game(): GameData
    loadLanguage(language: string): Promise<LanguageData>
}

export class Loader implements ILoader {
    private basePath: string
    private game: GameData | null = null
    private root: Game | null = null
    private languages: Map<string, LanguageData> = new Map()

    constructor(basePath: string = '/data') {
        this.basePath = basePath
    }

    public async loadRoot(): Promise<void> {
        await this.reset()
        logDebug('Root loaded: {0}', this.root)
    }

    public async reset(): Promise<void> {
        this.languages.clear()
        this.root = await loadJsonResource(`${this.basePath}/index.json`, gameSchema)
        this.game = {
            title: this.root.title,
            description: this.root.description,
            version: this.root.version,
            initialData: {
                language: this.root['initial-data'].language
            },
            languages: this.root.languages
        }
    }

    public async loadLanguage(language: string): Promise<LanguageData> {
        if (this.languages.has(language)) return this.languages.get(language)!
        const path = this.game?.languages[language]
        if (!path) fatalError('Language {0} was not found!', language)
        const schemaData = await loadJsonResource<Language>(`${this.basePath}/${path}`, languageSchema)
        const result: LanguageData = {
            name: schemaData.name,
            translations: { ...schemaData.translations }
        }
        this.languages.set(language, result)
        return result
    }

    public get Game(): GameData {
        if (this.game) return this.game
        fatalError('No game root loaded yet')
    }
}