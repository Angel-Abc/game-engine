export interface MapTileDefinition {
    key: string
    tile: string
}

export interface SquaresMap {
    type: 'squares-map'
    key: string
    name: string
    description: string
    width: number
    height: number
    tiles: Record<string, string>
    map: string[][]
}

export type GameMap = SquaresMap
