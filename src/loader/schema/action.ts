import { z } from 'zod'

export const postMessageActionSchema = z.object({
    type: z.literal('post-message'),
    message: z.string(),
    payload: z.union([z.number(), z.string(), z.record(z.string(), z.unknown())])
})

export const ActionSchema = z.discriminatedUnion('type', [postMessageActionSchema])

export type Action = z.infer<typeof ActionSchema>