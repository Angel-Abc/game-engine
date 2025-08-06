import { z } from 'zod'
import { conditionSchema } from './condition'

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
    'start-condition': conditionSchema,
    'start-with': z.string(),
    dialogs: z.array(dialogSchema)
})

export type Behavior = z.infer<typeof behaviorSchema>
export type Dialog = z.infer<typeof dialogSchema>
export type DialogSet = z.infer<typeof dialogSetSchema>
