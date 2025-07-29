import { z } from 'zod'

const gridScreenSchema = z.object({
    type: z.literal('grid'),
    width: z.number(),
    height: z.number()
})
const screenSchema = z.discriminatedUnion('type', [gridScreenSchema])

export const pageSchema = z.object({
    id: z.string(),
    screen: screenSchema
})
export type Page = z.infer<typeof pageSchema>
