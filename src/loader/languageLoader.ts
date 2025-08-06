import { loadJsonResource } from '@utils/loadJsonResource'
import { languageSchema, type Language } from './schema/language'
import type { Language as LanguageData } from './data/language'
import { mapLanguage } from './mappers/language'
import { logWarning } from '@utils/logMessage'

export interface ILanguageLoader {
    loadLanguage(language: string): Promise<LanguageData>
}

export async function languageLoader(basePath: string, paths: string[]): Promise<LanguageData> {
    const result: LanguageData = {
        id: '',
        translations: {},
    }
    for (const path of paths) {
        const schemaData = await loadJsonResource<Language>(`${basePath}/${path}`, languageSchema)
        const languageData = mapLanguage(schemaData)
        if (result.id === '') result.id = languageData.id
        if (result.id !== languageData.id) {
            logWarning('LanguageLoader', 'Unexpected language match {0} !== {1}', result.id, languageData.id)
        }
        result.translations = { ...result.translations, ...languageData.translations }
    }
    return result
}
