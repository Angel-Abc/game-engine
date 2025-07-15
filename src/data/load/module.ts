import { z } from 'zod'
import { componentSchema } from './component'
import { pageSchema } from './page'

export const moduleSchema = z.discriminatedUnion('type', [componentSchema, pageSchema])

export type Module = z.infer<typeof moduleSchema>
