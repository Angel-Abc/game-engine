import { z } from 'zod'

const componentPositionSchema = z.object({
    top: z.number(),
    left: z.number(),
    right: z.number(),
    bottom: z.number()
})

const baseComponentSchema = z.object({
    position: componentPositionSchema
})

const gameMenuComponentSchema = baseComponentSchema.extend({
    type: z.literal('game-menu')
})
const ComponentSchema = z.discriminatedUnion('type', [gameMenuComponentSchema])

const gridScreenSchema = z.object({
    type: z.literal('grid'),
    width: z.number(),
    height: z.number()
})
const screenSchema = z.discriminatedUnion('type', [gridScreenSchema])

export const pageSchema = z.object({
    id: z.string(),
    screen: screenSchema,
    components: z.array(ComponentSchema)
})
export type Page = z.infer<typeof pageSchema>
export type Screen = z.infer<typeof screenSchema>
export type Component = z.infer<typeof ComponentSchema>
