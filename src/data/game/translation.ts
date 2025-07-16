export interface LanguageData {
    name: string
    translations: Record<string, string>
}

export interface Translations {
    languages: Record<string, LanguageData>
}
