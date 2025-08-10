import { loadJsonResource } from '@utils/loadJsonResource'
import { fatalError, logDebug } from '@utils/logMessage'
import { gameSchema, type Game as SchemaGame } from './schema/game'
import { mapGame } from './mappers/game'
import type { Game as GameData } from './data/game'

export interface IGameLoader {
    loadRoot(): Promise<void>
    reset(): Promise<void>
    readonly Game: GameData
    readonly Styling: string[]
}

export class GameLoader implements IGameLoader {
    private basePath: string
    private game: GameData | null = null
    private styling: string[] = []
    private root: SchemaGame | null = null

    constructor(basePath: string = '/data') {
        this.basePath = basePath
    }

    private async fetchRoot(): Promise<void> {
        this.root = await loadJsonResource(`${this.basePath}/index.json`, gameSchema)
        const { game, styling } = mapGame(this.root, this.basePath)
        this.game = game
        this.styling = styling
    }

    public async loadRoot(): Promise<void> {
        await this.reset()
        logDebug('GameLoader', 'Root loaded: {0}', this.root)
    }

    public async reset(): Promise<void> {
        await this.fetchRoot()
    }

    public get Game(): GameData {
        if (this.game) return this.game
        fatalError('GameLoader', 'No game root loaded yet')
    }

    public get Styling(): string[] {
        return this.styling
    }
}

