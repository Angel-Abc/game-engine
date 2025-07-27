import { z } from 'zod'

export const initialDataSchema = z.object({
    language: z.string(),
    'start-page': z.string()
})

export const gameSchema = z.object({
    title: z.string(),
    description: z.string(),
    version: z.string(),
    'initial-data': initialDataSchema,
    languages: z.record(z.string(), z.string()),
    pages: z.record(z.string(), z.string())
})
export type Game = z.infer<typeof gameSchema>
