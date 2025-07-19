import { z } from 'zod'

export const mapTileDefinitionSchema = z.object({
    key: z.string(),
    tile: z.string(),
})

export const squaresMapSchema = z.object({
    key: z.string(),
    name: z.string(),
    description: z.string(),
    type: z.literal('squares-map'),
    width: z.number(),
    height: z.number(),
    tiles: z.array(mapTileDefinitionSchema),
    map: z.array(z.string()),
})

export type MapTileDefinition = z.infer<typeof mapTileDefinitionSchema>
export type SquaresMap = z.infer<typeof squaresMapSchema>
