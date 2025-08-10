import { loadJsonResource } from '@utils/loadJsonResource'
import { fatalError, logWarning } from '@utils/logMessage'
import { languageSchema, type Language } from './schema/language'
import type { Language as LanguageData } from './data/language'
import { mapLanguage } from './mappers/language'
import type { IGameLoader } from './gameLoader'

export interface ILanguageLoader {
    loadLanguage(language: string): Promise<LanguageData>
    reset(): void
}

export class LanguageLoader implements ILanguageLoader {
    private basePath: string
    private gameLoader: IGameLoader
    private cache: Map<string, LanguageData> = new Map()

    constructor(basePath: string, gameLoader: IGameLoader) {
        this.basePath = basePath
        this.gameLoader = gameLoader
    }

    public reset(): void {
        this.cache.clear()
    }

    public async loadLanguage(language: string): Promise<LanguageData> {
        if (this.cache.has(language)) return this.cache.get(language)!
        const paths = this.gameLoader.Game.languages[language]
            ?? fatalError('LanguageLoader', 'Language {0} was not found!', language)
        const result: LanguageData = {
            id: '',
            translations: {},
        }
        for (const path of paths) {
            const schemaData = await loadJsonResource<Language>(`${this.basePath}/${path}`, languageSchema)
            const languageData = mapLanguage(schemaData)
            if (result.id === '') result.id = languageData.id
            if (result.id !== languageData.id) {
                logWarning('LanguageLoader', 'Unexpected language match {0} !== {1}', result.id, languageData.id)
            }
            result.translations = { ...result.translations, ...languageData.translations }
        }
        this.cache.set(language, result)
        return result
    }
}
