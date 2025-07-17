import type { PageModule } from '@data/game/page'

type PageProps = {
    module: PageModule
}

const Page: React.FC<PageProps> = ({ module }): React.JSX.Element => {
    return (
        <div>
            <h1>Page</h1>
            <p>{module.description}</p>
            {/* Render other module-specific content here */}
        </div>
    )
}

export default Page
