import { loadJsonResource } from '@utils/loadJsonResource'
import { gameSchema, type Game } from './schema/game'
import { fatalError } from '@utils/logMessage'
import { type Game as GameData } from './data/game'

export interface ILoader {
    loadRoot(): Promise<void>
    reset(): void
    get Game(): GameData
    
}

export class Loader implements ILoader {
    private basePath: string
    private game: GameData | null = null
    private root: Game | null = null

    constructor(basePath: string = '/data') {
        this.basePath = basePath
    }

    public async loadRoot(): Promise<void> {
        this.root = await loadJsonResource(`${this.basePath}/index.json`, gameSchema)
    }

    public reset(): void {
        if (this.root === null) {
            fatalError('Loader root not initialized!')
        }
        this.game = {
            title: this.root.title,
            description: this.root.description,
            version: this.root.version,
            initialData: {
                language: this.root['initial-data'].language
            }
        }
    }

    public get Game(): GameData {
        if (this.game) return this.game
        fatalError('No game root loaded yet')
    }
}