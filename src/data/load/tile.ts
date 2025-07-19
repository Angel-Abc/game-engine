import { z } from 'zod'

export const tileSchema = z.object({
    key: z.string(),
    description: z.string(),
    color: z.string().optional(),
    image: z.string().optional(),
})

export const tilesSchema = z.object({
    tiles: z.array(tileSchema)
})

export type Tile = z.infer<typeof tileSchema>
export type TileIndex = z.infer<typeof tilesSchema>
