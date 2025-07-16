import { z } from 'zod'

export const VirtualKeySchema = z.object({
    virtualKey: z.string(),
    keyCode: z.string(),
    ctrl: z.union([z.undefined(), z.boolean()]),
    shift: z.union([z.undefined(), z.boolean()]),
    alt: z.union([z.undefined(), z.boolean()])
})

export const VirtualKeysSchema = z.array(VirtualKeySchema)

export const VirtualInputSchema = z.object({
    virtualInput: z.string(),
    virtualKeys: z.array(z.string()),
    label: z.string()
})

export const VirtualInputsSchema = z.array(VirtualInputSchema)

export type VirtualKey = z.infer<typeof VirtualKeySchema>
export type VirtualKeys = z.infer<typeof VirtualKeysSchema>
export type VirtualInput = z.infer<typeof VirtualInputSchema>
export type VirtualInputs = z.infer<typeof VirtualInputsSchema>
