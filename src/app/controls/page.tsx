import type { Page as PageData } from '@loader/data/page'
import type { IGameEngine } from '@engine/gameEngine'
import { Screen } from './screen'

export type PageProps = {
    page: PageData | null
    engine: IGameEngine
}

export const Page: React.FC<PageProps> = ({ page, engine }): React.JSX.Element => {
    if (page === null) return (<></>)
    return (
        <Screen screen={page.screen} engine={engine} />
    )
}
