import { z } from 'zod'

export const virtualKeySchema = z.object({
    virtualKey: z.string(),
    keyCode: z.string(),
    shift: z.boolean().optional(),
    ctrl: z.boolean().optional(),
    alt: z.boolean().optional(),
})
export const virtualKeysSchema = z.array(virtualKeySchema)

export const virtualInputSchema = z.object({
    virtualInput: z.string(),
    virtualKeys: z.array(z.string()),
    label: z.string()
})
export const virtualInputsSchema = z.array(virtualInputSchema)

export type VirtualKeys = z.infer<typeof virtualKeysSchema>
export type VirtualInputs = z.infer<typeof virtualInputsSchema>
