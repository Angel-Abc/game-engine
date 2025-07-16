import { z } from 'zod'

export const translationsIndexSchema = z.object({
    languages: z.array(z.string())
})

export const languageDataSchema = z.object({
    name: z.string(),
    translations: z.record(z.string(), z.string())
})

export type TranslationsIndex = z.infer<typeof translationsIndexSchema>
export type LanguageData = z.infer<typeof languageDataSchema>
