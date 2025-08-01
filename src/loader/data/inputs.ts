export interface VirtualKey {
    virtualKey: string
    keyCode: string
    shift: boolean
    ctrl: boolean
    alt: boolean
}
export type VirtualKeys = VirtualKey[]

export interface VirtualInput {
    virtualInput: string
    virtualKeys: string[]
    label: string
}
export type VirtualInputs = VirtualInput[]
