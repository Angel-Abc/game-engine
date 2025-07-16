export type VirtualKey = {
    virtualKey: string
    keyCode: string
    ctrl: boolean
    shift: boolean
    alt: boolean
}

export type VirtualInput = {
    virtualInput: string
    virtualKeys: VirtualKey[]
    label: string
}
