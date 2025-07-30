import { z } from 'zod'
import { ActionSchema } from './action'

export const buttonSchema = z.object({
    label: z.string(),
    action: ActionSchema
})

export type Button = z.infer<typeof buttonSchema>
