import type { Page } from '@loader/data/page'
import type { GameMap } from '@loader/data/map'
import type { Tile } from '@loader/data/tile'
import type { DialogSet } from '@loader/data/dialog'

export type DialogState = {
    [key: string]: unknown
}

export type DialogsState = {
    activeDialog: string | null
    isModalDialog: boolean
    dialogSets: Record<string, DialogSet>
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
