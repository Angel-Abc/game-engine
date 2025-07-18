import type { PageModule } from '@data/game/page'
import ScreenControl from './controls/screen'
import type { CSSProperties } from 'react'

type PageProps = {
    module: PageModule
}

const Page: React.FC<PageProps> = ({ module }): React.JSX.Element => {
    return (
        <ScreenControl screen={module.screen}>
            {module.components.map((c, idx) => {
                const { row, column, rowSpan = 1, columnSpan = 1 } = c.position
                const style: CSSProperties = {
                    gridRow: `${row + 1} / span ${rowSpan}`,
                    gridColumn: `${column + 1} / span ${columnSpan}`,
                }
                return (
                    <div key={idx} style={style}>
                        <div>{c.component.description}</div>
                    </div>
                )
            })}
        </ScreenControl>
    )
}

export default Page
