import { TranslationService, type ITranslationService } from './translationService'

export function createTranslationService(): ITranslationService {
    return new TranslationService()
}
