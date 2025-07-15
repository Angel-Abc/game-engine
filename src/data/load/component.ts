import { z } from 'zod'

export const buttonSchema = z.object({
    label: z.string(),
    action: z.string(),
})

export const gameMenuDataSchema = z.object({
    type: z.literal('game-menu'),
    buttons: z.array(buttonSchema),
})

export const componentDataSchema = z.discriminatedUnion('type', [gameMenuDataSchema])

export const componentSchema = z.object({
    type: z.literal('component'),
    description: z.string(),
    data: componentDataSchema,
})

export type Button = z.infer<typeof buttonSchema>
export type GameMenuData = z.infer<typeof gameMenuDataSchema>
export type ComponentData = z.infer<typeof componentDataSchema>
export type ComponentModule = z.infer<typeof componentSchema>
