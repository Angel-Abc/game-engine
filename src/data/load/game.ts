import { z } from 'zod'

export const gameSchema = z.object({
  title: z.string(),
  description: z.string(),
  version: z.string(),
  startPage: z.string(),
  modules: z.array(z.string()),
  translations: z.array(z.string()),
  inputs: z.array(z.string()).optional(),
  css: z.array(z.string()).optional(),
})

export type Game = z.infer<typeof gameSchema>
