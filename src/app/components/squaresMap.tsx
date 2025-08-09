import type { CSSCustomProperties } from '@app/types'
import { MAP_SWITCHED_MESSAGE, POSITION_CHANGED_MESSAGE } from '@engine/messages/messages'
import type { SquaresMapComponent } from '@loader/data/component'
import type { GameMap } from '@loader/data/map'
import { useEffect, useState } from 'react'
import { Tile } from './tile'
import { useGameEngine } from '@app/engineContext'

export type SquaresMapProps = {
    component: SquaresMapComponent
}

interface Position {
    x: number
    y: number
}

export const SquaresMap: React.FC<SquaresMapProps> = ({ component }): React.JSX.Element => {
    const engine = useGameEngine()
    const [activeMap, setActiveMap] = useState<string | null>(engine.StateManager.state.data.location.mapName)
    const [pos, setPos] = useState<Position>(engine.StateManager.state.data.location.position)

    useEffect(() => {
        const cleanup = engine.MessageBus.registerMessageListener(MAP_SWITCHED_MESSAGE, () => {
            setActiveMap(engine.StateManager.state.data.location.mapName)
        })
        return cleanup
    }, [engine])

    useEffect(() => {
        const cleanup = engine.MessageBus.registerMessageListener(
            POSITION_CHANGED_MESSAGE,
            msg => {
                if (msg?.payload) {
                    const payload = msg.payload as { x: number, y: number }
                    setPos({
                        x: payload.x,
                        y: payload.y
                    })
                }
            }
        )
        return cleanup
    }, [engine])

    const gameMap: GameMap | null = activeMap !== null ? engine.StateManager.state.maps[activeMap] : null
    if (!gameMap) return (<></>)

    const deltaX = Math.floor(component.mapSize.columns / 2)
    const deltaY = Math.floor(component.mapSize.rows / 2)

    const style: CSSCustomProperties = {
        '--ge-map-viewport-width': component.mapSize.columns.toString(),
        '--ge-map-viewport-height': component.mapSize.rows.toString(),
        '--ge-map-area-width': gameMap.width.toString(),
        '--ge-map-area-height': gameMap.height.toString(),
        '--ge-map-position-left': (pos.x - deltaX).toString(),
        '--ge-map-position-top': (pos.y - deltaY).toString()
    }
    return (
        <div style={style} className='squares-map'>
            <div className='viewport'>
                <div className='area'>
                    {gameMap.map.map((row, rowIndex) => {
                        return row.map((tileKey, columnIndex) => {
                            const mapTile = gameMap.tiles[tileKey]
                            const tile = engine.StateManager.state.tiles[mapTile.tile]
                            const key = `${tileKey}-${rowIndex}-${columnIndex}`
                            return (
                                <Tile
                                    key={key}
                                    tile={tile}
                                    isPlayerPosition={pos.x === columnIndex && pos.y === rowIndex}
                               />
                            )
                        })
                    })}
                </div>
            </div>
        </div>
    )
}
