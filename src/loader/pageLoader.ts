import { loadJsonResource } from '@utils/loadJsonResource'
import type { Page as PageData } from './data/page'
import { type Page, pageSchema } from './schema/page'
import { mapPage } from './mappers/page'

export interface IPageLoader {
    loadPage(page: string): Promise<PageData>
}

interface Context {
    basePath: string
    path: string
}

export async function pageLoader(context: Context): Promise<PageData> {
    const schemaData = await loadJsonResource<Page>(`${context.basePath}/${context.path}`, pageSchema)
    return mapPage(context, schemaData)
}

