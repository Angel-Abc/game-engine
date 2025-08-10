import { loadJsonResource } from '@utils/loadJsonResource'
import type { DialogSet as DialogSetData } from './data/dialog'
import { dialogSetSchema, type DialogSet as DialogSetSchema } from './schema/dialog'
import { mapDialogSet } from './mappers/dialog'
import { fatalError } from '@utils/logMessage'
import type { IGameLoader } from './gameLoader'

export interface IDialogLoader {
    loadDialog(id: string): Promise<DialogSetData>
    reset(): void
}

export class DialogLoader implements IDialogLoader {
    private basePath: string
    private gameLoader: IGameLoader
    private cache: Map<string, DialogSetData> = new Map()

    constructor(basePath: string, gameLoader: IGameLoader) {
        this.basePath = basePath
        this.gameLoader = gameLoader
    }

    public reset(): void {
        this.cache.clear()
    }

    public async loadDialog(id: string): Promise<DialogSetData> {
        if (this.cache.has(id)) return this.cache.get(id)!
        const path = this.gameLoader.Game.dialogs[id] ?? fatalError('DialogLoader', 'Unknown dialog: {0}', id)
        const schemaData = await loadJsonResource<DialogSetSchema>(`${this.basePath}/${path}`, dialogSetSchema)
        const dialogData = mapDialogSet(schemaData)
        this.cache.set(id, dialogData)
        return dialogData
    }
}

