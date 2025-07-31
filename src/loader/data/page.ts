import type { Component } from './component'

export interface GridScreenPosition {
    top: number
    left: number
    right: number
    bottom: number
}

export interface GridScreenItem {
    position: GridScreenPosition
    component: Component
}

export interface GridScreen {
    type: 'grid'
    width: number
    height: number
    components: GridScreenItem[]
}
export type Screen = GridScreen

export type Page = {
    id: string
    screen: Screen
}