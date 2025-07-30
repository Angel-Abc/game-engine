import type { Component } from './component'

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