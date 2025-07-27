import { z } from 'zod'

export const pageSchema = z.object({
    id: z.string()
})
export type Page = z.infer<typeof pageSchema>
