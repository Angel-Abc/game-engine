import { z } from 'zod'
import { buttonSchema } from './button'

const gameMenuComponentSchema = z.object({
    type: z.literal('game-menu'),
    buttons: z.array(buttonSchema)
})

const imageComponentSchema = z.object({
    type: z.literal('image'),
    image: z.string()
})

export const componentSchema = z.discriminatedUnion('type', [gameMenuComponentSchema, imageComponentSchema])

export type Component = z.infer<typeof componentSchema>
