import type { CSSCustomProperties } from '@app/types'
import type { Component, Screen as ScreenData } from '@loader/data/page'

export type ScreenProps = {
    screen: ScreenData
    components: Component[]
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
                            '--grid-top': component.position.top.toString(),
                            '--grid-left': component.position.left.toString(),
                            '--grid-right': component.position.right.toString(),
                            '--grid-bottom': component.position.bottom.toString(),
                        }
                        return (
                            <div className='grid-component' style={componentStyle} key={key}>
                                TODO: render component here
                            </div>
                        )
                    })}
                </div>
            )
        }
    }
}