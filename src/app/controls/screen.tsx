import type { CSSCustomProperties } from '@app/types'
import type { Screen as ScreenData } from '@loader/data/page'
import type { ReactNode } from 'react'

export type ScreenProps = {
    screen: ScreenData
    children?: ReactNode
}

export const Screen: React.FC<ScreenProps> = ({ screen, children }): React.JSX.Element => {
    switch (screen.type){
        case 'grid': {
            const style: CSSCustomProperties = {
                '--ge-grid-width': screen.width.toString(),
                '--ge-grid-height': screen.height.toString(),
            }
            return <div style={style} className='screen-grid'>{children}</div>
        }
    }
}