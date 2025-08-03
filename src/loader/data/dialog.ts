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
    dialogs: Dialog[]
}
