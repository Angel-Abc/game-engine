import type { Condition } from './condition'

export type Behavior = {
    canMove: boolean
}

export type Dialog = {
    id: string
    message: string
    behavior: Behavior
}

export type DialogSet = {
    id: string
    startCondition: Condition
    startWith: string
    dialogs: Dialog[]
}
