import { loadJsonResource } from '@utils/loadJsonResource'
import type { Page as PageData, Screen as ScreenData } from './data/page'
import { type Page, pageSchema } from './schema/page'

export async function pageLoader(path: string, update: (page: PageData) => void): Promise<PageData> {
    const schemaData = await loadJsonResource<Page>(path, pageSchema)
    let screen: ScreenData
    switch (schemaData.screen.type) {
        case 'grid':
            screen = {
                type: 'grid',
                width: schemaData.screen.width,
                height: schemaData.screen.height
            }
    }
    const result: PageData = {
        id: schemaData.id,
        screen: screen
    }
    update(result)
    return result
}