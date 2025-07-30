import { z } from 'zod'
import { ComponentSchema } from './component'

const gridScreenSchema = z.object({
    type: z.literal('grid'),
    width: z.number(),
    height: z.number()
})
const screenSchema = z.discriminatedUnion('type', [gridScreenSchema])

export const pageSchema = z.object({
    id: z.string(),
    screen: screenSchema,
    components: z.array(ComponentSchema),
})

export type Page = z.infer<typeof pageSchema>
export type Screen = z.infer<typeof screenSchema>
