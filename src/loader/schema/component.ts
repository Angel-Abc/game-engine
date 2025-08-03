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

const squaresMapComponentSchema = z.object({
    type: z.literal('squares-map'),
    mapSize: z.object({
        rows: z.int().positive(),
        columns: z.int().positive()
    })
})

const inputMatrxComponentSchema = z.object({
    type: z.literal('input-matrix'),
    matrixSize: z.object({
        width: z.int().positive(),
        height: z.int().positive()
    })
})

export const componentSchema = z.discriminatedUnion('type', [
    gameMenuComponentSchema, 
    imageComponentSchema, 
    squaresMapComponentSchema,
    inputMatrxComponentSchema
])

export type Component = z.infer<typeof componentSchema>
