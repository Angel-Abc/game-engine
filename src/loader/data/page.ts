import type { Button } from './button'

export interface ComponentPosition {
    top: number
    left: number
    right: number
    bottom: number
}

export interface BaseComponent {
    position: ComponentPosition
}

export interface GameMenuComponent extends BaseComponent {
    type: 'game-menu'
    buttons: Button[]
}
export type Component = GameMenuComponent

export interface GridScreen {
    type: 'grid'
    width: number
    height: number
}
export type Screen = GridScreen

export type Page = {
    id: string
    screen: Screen
    components: Component[]
}