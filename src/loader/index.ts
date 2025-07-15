import { loadJsonResource } from '@utility/loadJsonResource'
import { gameSchema } from '@data/load/game'
import { moduleSchema } from '@data/load/module'
import { componentSchema } from '@data/load/component'
import type { GameData } from '@data/game/game'
import type { Module } from '@data/game/module'
import type { ComponentModule } from '@data/game/component'
import type { PageModule, PageComponent } from '@data/game/page'

const BASE_PATH = '/data'

const moduleCache: Map<string, Module> = new Map()

export async function loadGameData(basePath: string = BASE_PATH): Promise<GameData> {
    const gameLoad = await loadJsonResource(`${basePath}/game.json`, gameSchema)

    const modules: Record<string, Module> = {}
    for (const m of gameLoad.modules) {
        modules[m] = await loadModule(m, basePath)
    }

    return {
        title: gameLoad.title,
        description: gameLoad.description,
        modules
    }
}

export async function loadModule(modulePath: string, basePath: string = BASE_PATH): Promise<Module> {
    if (moduleCache.has(modulePath)) {
        return moduleCache.get(modulePath) as Module
    }

    const load = await loadJsonResource(`${basePath}/${modulePath}/index.json`, moduleSchema)

    let result: Module
    if (load.type === 'component') {
        result = {
            type: 'component',
            description: load.description,
            data: { ...load.data }
        } as ComponentModule
    } else {
        const components: PageComponent[] = []
        for (const c of load.components) {
            const comp = await loadComponentModule(c.type, basePath)
            components.push({ component: comp, position: { ...c.position } })
        }
        result = {
            type: 'page',
            description: load.description,
            screen: { ...load.screen },
            components
        } as PageModule
    }

    moduleCache.set(modulePath, result)
    return result
}

export async function loadComponentModule(type: string, basePath: string = BASE_PATH): Promise<ComponentModule> {
    // Components are stored under components/<type>
    const path = `components/${type}`
    const cached = moduleCache.get(path)
    if (cached) {
        return cached as ComponentModule
    }

    const load = await loadJsonResource(`${basePath}/${path}/index.json`, componentSchema)

    const result: ComponentModule = {
        type: 'component',
        description: load.description,
        data: { ...load.data }
    }

    moduleCache.set(path, result)
    return result
}
