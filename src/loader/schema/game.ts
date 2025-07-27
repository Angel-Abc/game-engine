import { z } from 'zod'

export const initialDataSchema = z.object({
    language: z.string()
})

export const gameSchema = z.object({
    title: z.string(),
    description: z.string(),
    version: z.string(),
    'initial-data': initialDataSchema
})
export type Game = z.infer<typeof gameSchema>
