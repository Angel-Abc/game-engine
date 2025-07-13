import { z } from 'zod'

export const gameSchema = z.object({
  title: z.string(),
  'start-screen': z.string(),
  'game-data': z.string(),
})

export type Game = z.infer<typeof gameSchema>
