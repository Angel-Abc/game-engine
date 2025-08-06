import type { Page } from '@loader/data/page'
import type { GameMap } from '@loader/data/map'
import type { Tile } from '@loader/data/tile'
import type { DialogSet } from '@loader/data/dialog'

export type ContextData = {
    language: string,
    pages: Record<string, Page>,
    maps: Record<string, GameMap>,
    dialogs: Record<string, DialogSet>,
    tiles: Record<string, Tile>,
    tileSets: Record<string, boolean>,
    data: {
        activePage: string | null
        activeDialog: string | null
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
