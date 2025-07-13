import { z } from 'zod'

export const moduleSchema = z.object({
  type: z.enum(['component', 'page']),
  description: z.string(),
})

export type Module = z.infer<typeof moduleSchema>
