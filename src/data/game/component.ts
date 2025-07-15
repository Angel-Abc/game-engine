export interface Button {
    label: string
    action: string
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
