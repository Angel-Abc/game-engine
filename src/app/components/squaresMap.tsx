import type { CSSCustomProperties } from '@app/types'
import { getGameEngine } from '@engine/gameEngine'
import { MAP_SWITCHED_MESSAGE } from '@engine/messages'
import type { SquaresMapComponent } from '@loader/data/component'
import type { GameMap } from '@loader/data/map'
import { useEffect, useState } from 'react'
import { Tile } from './tile'

export type SquaresMapProps = {
    component: SquaresMapComponent
}

export const SquaresMap: React.FC<SquaresMapProps> = ({ component }): React.JSX.Element => {
    const engine = getGameEngine()
    const [activeMap, setActiveMap] = useState<string | null>(engine.StateManager.state.data.activeMap)
    useEffect(() => {
        const cleanup = engine.MessageBus.registerMessageListener(MAP_SWITCHED_MESSAGE, () => {
            setActiveMap(engine.StateManager.state.data.activeMap)
        })
        return cleanup
    }, [engine])
    const gameMap: GameMap | null = activeMap !== null ? engine.StateManager.state.maps[activeMap] : null
    if (!gameMap) return (<></>)

    const style: CSSCustomProperties = {
        '--ge-map-viewport-width': component.mapSize.columns.toString(),
        '--ge-map-viewport-height': component.mapSize.rows.toString(),
        '--ge-map-area-width': gameMap.width.toString(),
        '--ge-map-area-height': gameMap.height.toString(),
        '--ge-map-position-top': '0',
        '--ge-map-position-left': '0'
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
                                    isPlayerPosition={false}
                               />
                            )
                        })
                    })}
                </div>
            </div>
        </div>
    )
}