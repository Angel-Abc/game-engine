import { z } from 'zod'
import { componentSchema } from './component'

const gridScreenPositionSchema = z.object({
    top: z.number(),
    left: z.number(),
    right: z.number(),
    bottom: z.number()
})

const gridScreenItemSchema = z.object({
    position: gridScreenPositionSchema,
    component: componentSchema    
})

const gridScreenSchema = z.object({
    type: z.literal('grid'),
    width: z.number(),
    height: z.number(),
    components: z.array(gridScreenItemSchema),
})
const screenSchema = z.discriminatedUnion('type', [gridScreenSchema])

export const pageSchema = z.object({
    id: z.string(),
    screen: screenSchema,
})

export type Page = z.infer<typeof pageSchema>
export type Screen = z.infer<typeof screenSchema>
export type GridScreenItem = z.infer<typeof gridScreenItemSchema>
