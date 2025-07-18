export interface ButtonAction {
    type?: string
    message: string
    payload?: null | number | string | Record<string, unknown>
}

export interface Button {
    label: string
    action: ButtonAction
}

export interface GameMenuData {
    type: 'game-menu'
    buttons: Button[]
}

export type ComponentData = GameMenuData

export interface ComponentModule {
    type: 'component'
    description: string
    data: ComponentData
}
