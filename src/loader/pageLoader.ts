import { loadJsonResource } from '@utils/loadJsonResource'
import type { Page as PageData } from './data/page'
import { type Page, pageSchema } from './schema/page'
import { mapInputs } from './mappers/input'
import { mapScreen } from './mappers/page'

interface Context {
    basePath: string
    path: string
}

export async function pageLoader(context: Context): Promise<PageData> {
    const schemaData = await loadJsonResource<Page>(`${context.basePath}/${context.path}`, pageSchema)
    return {
        id: schemaData.id,
        screen: mapScreen(context, schemaData.screen),
        inputs: mapInputs(schemaData.inputs)
    }
}

