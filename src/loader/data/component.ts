import type { Button } from './button'

export interface GameMenuComponent {
    type: 'game-menu'
    buttons: Button[]
}

export interface ImageComponent {
    type: 'image'
    image: string
}

export type Component = GameMenuComponent | ImageComponent

