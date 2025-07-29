import type { Page as PageData } from '@loader/data/page'
import { Screen } from './screen'
export type PageProps = {
    page: PageData | null
}

export const Page: React.FC<PageProps> = ({ page }): React.JSX.Element => {
    if (page === null) return (<></>)
    return (
        <Screen screen={page.screen}>
            <div>{page.id}</div>
        </Screen>
    )
}