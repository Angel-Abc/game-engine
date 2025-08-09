import type { Page } from '@loader/data/page'
import type { GameMap } from '@loader/data/map'
import type { Tile } from '@loader/data/tile'
import type { DialogSet } from '@loader/data/dialog'
import type { Input } from '@loader/data/inputs'

export type DialogChoice = {
    id: string
    input: Input
}

export type DialogState = {
    activeChoices: DialogChoice[]
    [key: string]: unknown
}

export type DialogsState = {
    activeDialog: string | null
    isModalDialog: boolean
    dialogStates: Record<string, DialogState>
}

export type ContextData = {
    language: string,
    pages: Record<string, Page>,
    maps: Record<string, GameMap>,
    dialogSets: Record<string, DialogSet>,
    tiles: Record<string, Tile>,
    tileSets: Record<string, boolean>,
    dialogs: DialogsState,
    data: {
        activePage: string | null
        location: {
            mapName: string | null
            position: {
                x: number
                y: number
            }
            mapSize: {
                width: number
                height: number
            }
        }
        [key: string]: unknown
    }
}
