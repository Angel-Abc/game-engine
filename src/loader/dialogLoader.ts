import { loadJsonResource } from '@utils/loadJsonResource'
import type { DialogSet as DialogSetData } from './data/dialog'
import { dialogSetSchema, type DialogSet as DialogSetSchema } from './schema/dialog'
import { mapDialogSet } from './mappers/dialog'

interface Context {
    basePath: string
    path: string
}

export async function mapLoader(context: Context): Promise<DialogSetData> {
    const schemaData = await loadJsonResource<DialogSetSchema>(`${context.basePath}/${context.path}`, dialogSetSchema)
    return mapDialogSet(schemaData)
}
