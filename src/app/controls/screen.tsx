import type { CSSCustomProperties } from '@app/types'
import type { Screen as GameScreen } from '@data/game/screen'
import type { ReactNode } from 'react'

export type ScreenProps = {
    screen: GameScreen
    children?: ReactNode
}

const Screen: React.FC<ScreenProps> = ({ screen, children }): React.JSX.Element => {
    switch (screen.type) {
        case 'grid': {
            const style: CSSCustomProperties = {
                '--ge-grid-rows': screen.rows.toString(),
                '--ge-grid-columns': screen.columns.toString(),
            }
            return <div style={style} className='screen-grid'>{children}</div>
        }
        default:
            return <div>{children}</div>
    }
}

export default Screen
