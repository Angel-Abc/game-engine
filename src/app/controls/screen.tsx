import type { CSSCustomProperties } from '@app/types'
import type { Screen as ScreenData } from '@loader/data/page'
import { Component } from './component'
import { getGameEngine } from '@engine/gameEngine'

export type ScreenProps = {
    screen: ScreenData
}

export const Screen: React.FC<ScreenProps> = ({ screen }): React.JSX.Element => {
    const engine = getGameEngine()
    switch (screen.type) {
        case 'grid': {
            const style: CSSCustomProperties = {
                '--ge-grid-width': screen.width.toString(),
                '--ge-grid-height': screen.height.toString(),
            }
            return (
                <div style={style} className='screen-grid'>
                    {screen.components.map((item, index) => {
                        if (item.condition === undefined || engine.resolveCondition(item.condition)) {
                            const key = `${item.component.type}_${index}`
                            const componentStyle: CSSCustomProperties = {
                                '--ge-grid-item-top': (item.position.top + 1).toString(),
                                '--ge-grid-item-left': (item.position.left + 1).toString(),
                                '--ge-grid-item-right': (item.position.right + 1).toString(),
                                '--ge-grid-item-bottom': (item.position.bottom + 1).toString(),
                            }
                            return (
                                <div className='grid-component' style={componentStyle} key={key}>
                                    <Component component={item.component} />
                                </div>
                            )
                        } else return null
                    })}
                </div>
            )
        }
    }
}
