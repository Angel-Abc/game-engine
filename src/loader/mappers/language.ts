import type { Language as LanguageData } from '@loader/data/language'
import { type Language } from '@loader/schema/language'

export function mapLanguage(language: Language): LanguageData {
    return {
        id: language.id,
        translations: { ...language.translations }
    }
}
