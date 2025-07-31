import type { CSSCustomProperties } from '@app/types'
import type { Screen as ScreenData } from '@loader/data/page'
import { Component } from './component'

export type ScreenProps = {
    screen: ScreenData
}

export const Screen: React.FC<ScreenProps> = ({ screen }): React.JSX.Element => {
    switch (screen.type) {
        case 'grid': {
            const style: CSSCustomProperties = {
                '--ge-grid-width': screen.width.toString(),
                '--ge-grid-height': screen.height.toString(),
            }
            return (
                <div style={style} className='screen-grid'>
                    {screen.components.map((item, index) => {
                        const key = `${item.component.type}_${index}`
                        const componentStyle: CSSCustomProperties = {
                            '--grid-top': (item.position.top + 1).toString(),
                            '--grid-left': (item.position.left + 1).toString(),
                            '--grid-right': (item.position.right + 1).toString(),
                            '--grid-bottom': (item.position.bottom + 1).toString(),
                        }
                        return (
                            <div className='grid-component' style={componentStyle} key={key}>
                                <Component component={item.component} />
                            </div>
                        )

                    })}
                </div>
            )
        }
    }
}
