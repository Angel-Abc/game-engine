import type { CSSCustomProperties } from '@app/types'
import type { SquaresMapComponent } from '@loader/data/component'

export type SquaresMapProps = {
    component: SquaresMapComponent
}

export const SquaresMap: React.FC<SquaresMapProps> = ({ component }): React.JSX.Element => {
    const style: CSSCustomProperties = {
        "--ge-map-viewport-width": component.mapSize.columns.toString(),
        "--ge-map-viewport-height": component.mapSize.rows.toString()
    }
    return (
        <div style={style} className='squares-map'>
            <div className='viewport'>
                <div className='area'>
                    
                </div>
            </div>
        </div>
    )
}