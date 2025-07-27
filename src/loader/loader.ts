import { loadJsonResource } from '@utils/loadJsonResource'
import { gameSchema, type Game } from './schema/game'
import { fatalError } from '@utils/logMessage'

export interface ILoader {
    loadRoot(): Promise<void>
    reset(): void
    get Game(): Game
}

export class Loader implements ILoader {
    private basePath: string
    private game: Game | null = null


    constructor(basePath: string = '/data') {
        this.basePath = basePath
    }

    public async loadRoot(): Promise<void> {
        this.game = await loadJsonResource(`${this.basePath}/index.json`, gameSchema)
    }

    public reset(): void {
        // clear all cached data
    }

    public get Game(): Game {
        if (this.game) return this.game
        fatalError('No game root loaded yet')
    }
}