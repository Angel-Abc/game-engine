import { GameLoader, type IGameLoader } from './gameLoader'
import { HandlerLoader, type IHandlerLoader } from './handlerLoader'
import { TileLoader, type ITileLoader } from './tileLoader'
import { DialogLoader, type IDialogLoader } from './dialogLoader'
import { InputLoader, type IInputLoader } from './inputsLoader'
import { PageLoader, type IPageLoader } from './pageLoader'
import { MapLoader, type IMapLoader } from './mapLoader'
import { LanguageLoader, type ILanguageLoader } from './languageLoader'

export class Loader {
    public readonly gameLoader: IGameLoader
    public readonly handlerLoader: IHandlerLoader
    public readonly tileLoader: ITileLoader
    public readonly dialogLoader: IDialogLoader
    public readonly inputLoader: IInputLoader
    public readonly languageLoader: ILanguageLoader
    public readonly pageLoader: IPageLoader
    public readonly mapLoader: IMapLoader

    constructor(basePath: string = '/data') {
        this.gameLoader = new GameLoader(basePath)
        this.handlerLoader = new HandlerLoader(basePath)
        this.tileLoader = new TileLoader(basePath, this.gameLoader)
        this.dialogLoader = new DialogLoader(basePath, this.gameLoader)
        this.inputLoader = new InputLoader(basePath)
        this.languageLoader = new LanguageLoader(basePath, this.gameLoader)
        this.pageLoader = new PageLoader(basePath, this.gameLoader)
        this.mapLoader = new MapLoader(basePath, this.gameLoader)
    }
}

export type { IGameLoader } from './gameLoader'
export type { IHandlerLoader } from './handlerLoader'
export type { ITileLoader } from './tileLoader'
export type { IDialogLoader } from './dialogLoader'
export type { IInputLoader } from './inputsLoader'
export type { IPageLoader } from './pageLoader'
export type { IMapLoader } from './mapLoader'
export type { ILanguageLoader } from './languageLoader'

