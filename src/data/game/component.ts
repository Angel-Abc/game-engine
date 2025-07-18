export interface PostMessageButtonAction {
    type: 'post-message'
    message: string
    payload?: null | number | string | Record<string, unknown>
}

export type ButtonAction = PostMessageButtonAction

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
