import type React from 'react'
import type { GameMap } from '@loader/data/map'
import type { Tile } from '@loader/data/tile'
import '../../style/game.css'

type CSSCustomProperties = React.CSSProperties & {
    [key: `--${string}`]: string
}

type ViewportSize = {
    columns: number
    rows: number
}

type Position = {
    x: number
    y: number
}

export interface MapViewportProps {
    map: GameMap
    tiles: Record<string, Tile>
    viewport?: ViewportSize
    position?: Position
}

export const MapViewport: React.FC<MapViewportProps> = ({ map, tiles, viewport, position }) => {
    const viewportSize: ViewportSize = viewport ?? { columns: map.width, rows: map.height }
    const deltaX = Math.floor(viewportSize.columns / 2)
    const deltaY = Math.floor(viewportSize.rows / 2)
    const pos: Position = position ?? { x: deltaX, y: deltaY }

    const style: CSSCustomProperties = {
        '--ge-map-viewport-width': viewportSize.columns.toString(),
        '--ge-map-viewport-height': viewportSize.rows.toString(),
        '--ge-map-area-width': map.width.toString(),
        '--ge-map-area-height': map.height.toString(),
        '--ge-map-position-left': (pos.x - deltaX).toString(),
        '--ge-map-position-top': (pos.y - deltaY).toString(),
    }

    return (
        <div style={style} className='squares-map'>
            <div className='viewport'>
                <div className='area'>
                    {map.map.map((row, rowIndex) =>
                        row.map((tileKey, columnIndex) => {
                            const mapTile = map.tiles[tileKey]
                            const tile = tiles[mapTile.tile]
                            const key = `${tileKey}-${rowIndex}-${columnIndex}`
                            const tileStyle: CSSCustomProperties = {
                                '--ge-map-tile-color': tile.color || 'transparent',
                            }
                            return (
                                <div key={key} style={tileStyle}>
                                    {tile.image && <img src={tile.image} />}
                                </div>
                            )
                        }),
                    )}
                </div>
            </div>
        </div>
    )
}

