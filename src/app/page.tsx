import type { Page as PageData } from 'src/loader/data/page'

type PageProps = {
    page: PageData | null
}

export const Page: React.FC<PageProps> = ({ page }): React.JSX.Element => {
    return (
        <div>{page?.id ?? 'NULL'}</div>
    )
}