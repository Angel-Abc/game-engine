import { loadJsonResource } from '@utils/loadJsonResource'
import { gameSchema, type Game } from './schema/game'
import { fatalError, logDebug } from '@utils/logMessage'
import { type Game as GameData } from './data/game'
import { PageLoader, type IPageLoader } from './pageLoader'
import type { Handlers } from './data/handler'
import { handlerLoader } from './handlerLoader'
import type { TileSet as TileSetData } from './data/tile'
import { tileLoader, type ITileLoader } from './tileLoader'
import { MapLoader, type IMapLoader } from './mapLoader'
import type { VirtualKeys as VirtualKeysData, VirtualInputs as VirtualInputsData } from './data/inputs'
import { virtualKeysLoader, virtualInputsLoader, type IInputLoader } from './inputsLoader'
import { mapGame } from './mappers/game'
import type { DialogSet } from './data/dialog'
import { dialogLoader, type IDialogLoader } from './dialogLoader'
import { LanguageLoader, type ILanguageLoader } from './languageLoader'

export type { IPageLoader } from './pageLoader'
export type { ITileLoader } from './tileLoader'
export type { IMapLoader } from './mapLoader'
export type { IDialogLoader } from './dialogLoader'
export type { IInputLoader } from './inputsLoader'
export type { ILanguageLoader } from './languageLoader'

export interface IGameLoader {
    loadRoot(): Promise<void>
    reset(): Promise<void>
    readonly Game: GameData
    readonly Styling: string[]
}

export interface IHandlerLoader {
    loadHandlers(path: string): Promise<Handlers>
}

export class Loader implements IGameLoader, ITileLoader, IDialogLoader, IInputLoader, IHandlerLoader {
    private basePath: string
    private game: GameData | null = null
    private styling: string[] = []
    private root: Game | null = null
    private handlers: Map<string, Handlers> = new Map()
    private tileSets: Map<string, TileSetData> = new Map()
    private dialogs: Map<string, DialogSet> = new Map()
    private virtualKeys: Map<string, VirtualKeysData> = new Map()
    private virtualInputs: Map<string, VirtualInputsData> = new Map()

    public readonly languageLoader: ILanguageLoader
    public readonly pageLoader: IPageLoader
    public readonly mapLoader: IMapLoader

    constructor(basePath: string = '/data') {
        this.basePath = basePath
        this.languageLoader = new LanguageLoader(basePath, this)
        this.pageLoader = new PageLoader(basePath, this)
        this.mapLoader = new MapLoader(basePath, this)
    }

    private async loadWithCache<T>(cache: Map<string, T>, key: string, loader: () => Promise<T>): Promise<T> {
        if (cache.has(key)) return cache.get(key)!
        const result = await loader()
        cache.set(key, result)
        return result
    }

    public async loadRoot(): Promise<void> {
        await this.reset()
        logDebug('Loader', 'Root loaded: {0}', this.root)
    }

    public async reset(): Promise<void> {
        this.handlers.clear()
        this.tileSets.clear()
        this.virtualKeys.clear()
        this.virtualInputs.clear()
        this.languageLoader.reset()
        this.pageLoader.reset()
        this.mapLoader.reset()
        this.root = await loadJsonResource(`${this.basePath}/index.json`, gameSchema)
        const { game, styling } = mapGame(this.root, this.basePath)
        this.game = game
        this.styling = styling
    }

    public async loadTileSet(id: string): Promise<TileSetData> {
        return this.loadWithCache(this.tileSets, id, async () => {
            const path = this.game?.tiles[id] ?? fatalError('Loader', 'Unknown tile set: {0}', id)
            return tileLoader({ basePath: this.basePath, path })
        })
    }

    public async loadDialog(id: string): Promise<DialogSet> {
        return this.loadWithCache(this.dialogs, id, async () => {
            const path = this.game?.dialogs[id] ?? fatalError('Loader', 'Unknown dialog: {0}', id)
            return dialogLoader({ basePath: this.basePath, path })
        })
    }

    public async loadHandlers(path: string): Promise<Handlers> {
        return this.loadWithCache(this.handlers, path, () => handlerLoader(this.basePath, path))
    }

    public async loadVirtualKeys(path: string): Promise<VirtualKeysData> {
        return this.loadWithCache(this.virtualKeys, path, () => virtualKeysLoader(this.basePath, path))
    }

    public async loadVirtualInputs(path: string): Promise<VirtualInputsData> {
        return this.loadWithCache(this.virtualInputs, path, () => virtualInputsLoader(this.basePath, path))
    }

    public get Game(): GameData {
        if (this.game) return this.game
        fatalError('Loader', 'No game root loaded yet')
    }

    public get Styling(): string[] {
        return this.styling
    }
}
