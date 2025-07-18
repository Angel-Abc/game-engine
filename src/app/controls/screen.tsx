import type { Screen as GameScreen } from '@data/game/screen'
import type { CSSProperties, ReactNode } from 'react'

export type ScreenProps = {
    screen: GameScreen
    children?: ReactNode
}

const ScreenControl: React.FC<ScreenProps> = ({ screen, children }): React.JSX.Element => {
    switch (screen.type) {
        case 'grid': {
            const style: CSSProperties = {
                display: 'grid',
                width: '100vw',
                height: '100vh',
                gridTemplateRows: `repeat(${screen.rows}, 1fr)`,
                gridTemplateColumns: `repeat(${screen.columns}, 1fr)`
            }
            return <div style={style}>{children}</div>
        }
        default:
            return <div>{children}</div>
    }
}

export default ScreenControl
