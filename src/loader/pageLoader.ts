import { loadJsonResource } from '@utils/loadJsonResource'
import type { Page as PageData } from './data/page'
import { type Page, pageSchema } from './schema/page'
import { mapPage } from './mappers/page'
import { fatalError } from '@utils/logMessage'
import type { IGameLoader } from './gameLoader'

export interface IPageLoader {
    loadPage(page: string): Promise<PageData>
    reset(): void
}

export class PageLoader implements IPageLoader {
    private basePath: string
    private gameLoader: IGameLoader
    private cache: Map<string, PageData> = new Map()

    constructor(basePath: string, gameLoader: IGameLoader) {
        this.basePath = basePath
        this.gameLoader = gameLoader
    }

    public reset(): void {
        this.cache.clear()
    }

    public async loadPage(page: string): Promise<PageData> {
        if (this.cache.has(page)) return this.cache.get(page)!
        const path = this.gameLoader.Game.pages[page]
            ?? fatalError('PageLoader', 'Unknown page: {0}', page)
        const schemaData = await loadJsonResource<Page>(`${this.basePath}/${path}`, pageSchema)
        const context = { basePath: this.basePath, path }
        const pageData = mapPage(context, schemaData)
        this.cache.set(page, pageData)
        return pageData
    }
}
