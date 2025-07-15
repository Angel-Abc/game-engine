import { z } from 'zod'

export const gridScreenSchema = z.object({
    type: z.literal('grid'),
    rows: z.number(),
    columns: z.number(),
})

export const screenSchema = z.discriminatedUnion('type', [gridScreenSchema])

export type GridScreen = z.infer<typeof gridScreenSchema>
export type Screen = z.infer<typeof screenSchema>
