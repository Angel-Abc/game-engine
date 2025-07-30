import type { CSSCustomProperties } from '@app/types'
import type { Screen as ScreenData } from '@loader/data/page'
import type { Component as ComponentData } from '@loader/data/component'
import { Component } from './component'

export type ScreenProps = {
    screen: ScreenData
    components: ComponentData[]
}

export const Screen: React.FC<ScreenProps> = ({ screen, components }): React.JSX.Element => {
    switch (screen.type) {
        case 'grid': {
            const style: CSSCustomProperties = {
                '--ge-grid-width': screen.width.toString(),
                '--ge-grid-height': screen.height.toString(),
            }
            return (
                <div style={style} className='screen-grid'>
                    {components.map((component, index) => {
                        const key = `${component.type}_${index}`
                        const componentStyle: CSSCustomProperties = {
                            '--grid-top': (component.position.top + 1).toString(),
                            '--grid-left': (component.position.left + 1).toString(),
                            '--grid-right': (component.position.right + 1).toString(),
                            '--grid-bottom': (component.position.bottom + 1).toString(),
                        }
                        return (
                            <div className='grid-component' style={componentStyle} key={key}>
                                <Component component={component} />
                            </div>
                        )
                    })}
                </div>
            )
        }
    }
}