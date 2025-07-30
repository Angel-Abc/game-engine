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

export interface ImageComponent extends BaseComponent {
    type: 'image',
    image: string
}

export type Component = GameMenuComponent | ImageComponent

