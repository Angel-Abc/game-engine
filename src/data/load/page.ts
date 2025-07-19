import { z } from 'zod'
import { screenSchema } from './screen'

export const gridPositionSchema = z.object({
    row: z.number(),
    column: z.number(),
    rowSpan: z.number().optional(),
    columnSpan: z.number().optional(),
})

export const pageComponentSchema = z.object({
    type: z.string(),
    position: gridPositionSchema,
})

export const pageSchema = z.object({
    type: z.literal('page'),
    description: z.string(),
    screen: screenSchema,
    components: z.array(pageComponentSchema),
    'background-image': z.string().optional(),
})

export type GridPosition = z.infer<typeof gridPositionSchema>
export type PageComponent = z.infer<typeof pageComponentSchema>
export type PageModule = z.infer<typeof pageSchema>
