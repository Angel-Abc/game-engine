import { fatalError } from '@utils/logMessage'
import type { Language } from '@loader/data/language'

export interface ITranslationService {
    translate(key: string): string
    setLanguage(language: Language): void
}

export class TranslationService implements ITranslationService {
    private language: Language | null = null

    public setLanguage(language: Language): void {
        this.language = language    
    }

    public translate(key: string): string {
        if (this.language === null) fatalError('No language was set!')
        return this.language.translations[key] ?? key
    }
}