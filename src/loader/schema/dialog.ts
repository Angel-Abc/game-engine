import { z } from 'zod'

export const behaviorSchema = z.object({
    'can-move': z.boolean()
})

export const dialogSchema = z.object({
    id: z.string(),
    message: z.string(),
    behavior: behaviorSchema.optional()
})

export const dialogSetSchema = z.object({
    id: z.string(),
    'default-behavior': behaviorSchema,
    dialogs: z.array(dialogSchema)
})

export type Behavior = z.infer<typeof behaviorSchema>
export type Dialog = z.infer<typeof dialogSchema>
export type DialogSet = z.infer<typeof dialogSetSchema>
