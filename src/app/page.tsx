import type { PageModule } from '@data/game/page'
import Screen from './controls/screen'
import GameMenu from './components/gameMenu'
import type { CSSCustomProperties } from './types'
import type { ComponentModule } from '@data/game/component'

type PageProps = {
    module: PageModule
}

const Page: React.FC<PageProps> = ({ module }): React.JSX.Element => {
    return (
        <Screen screen={module.screen}>
            {module.components.map((c, idx) => {
                const { row, column, rowSpan = 1, columnSpan = 1 } = c.position
                const style: CSSCustomProperties = {
                    '--ge-grid-item-position-row-start': (row + 1).toString(),
                    '--ge-grid-item-position-column-start': (column + 1).toString(),
                    '--ge-grid-item-position-row-end': (row + 1 + rowSpan).toString(),
                    '--ge-grid-item-position-column-end': (column + 1 + columnSpan).toString(),
                }
                const key = `${idx}_${c.component.type}`
                const renderComponent = (component: ComponentModule): React.ReactNode => {
                    switch (component.data.type) {
                        case 'game-menu':
                            return <GameMenu data={component.data} />
                        default:
                            return <div>{component.description}</div>
                    }
                }
                return (
                    <div key={key} style={style} className='screen-component'>
                        {renderComponent(c.component)}
                    </div>
                )
            })}
        </Screen>
    )
}

export default Page
