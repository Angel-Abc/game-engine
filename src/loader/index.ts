import { loadJsonResource } from '@utility/loadJsonResource'
import { gameSchema } from '@data/load/game'
import { moduleSchema } from '@data/load/module'
import { componentSchema } from '@data/load/component'
import { translationsIndexSchema, languageDataSchema } from '@data/load/translation'
import { VirtualKeysSchema, VirtualInputsSchema } from '@data/load/virtualInput'
import type { GameData } from '@data/game/game'
import type { Module } from '@data/game/module'
import type { ComponentModule } from '@data/game/component'
import type { PageModule, PageComponent } from '@data/game/page'
import type { Translations, LanguageData } from '@data/game/translation'
import type { VirtualKey, VirtualInput } from '@data/game/virtualInput'

const BASE_PATH = '/data'
const RESOURCE_PATH = '/resources'

const moduleCache: Map<string, Module> = new Map()
const translationCache: Map<string, LanguageData> = new Map()
const virtualKeyCache: Map<string, VirtualKey> = new Map()

export async function loadGameData(basePath: string = BASE_PATH): Promise<GameData> {
    const gameLoad = await loadJsonResource(`${basePath}/game.json`, gameSchema)

    const modules: Record<string, Module> = {}
    for (const m of gameLoad.modules) {
        modules[m] = await loadModule(m, basePath)
    }

    const translations: Translations = { languages: {} }
    for (const t of gameLoad.translations) {
        const data = await loadTranslations(t, basePath)
        Object.assign(translations.languages, data.languages)
    }

    const inputPaths = gameLoad.inputs ?? []
    const virtualKeys = await loadVirtualKeys(inputPaths, basePath)
    const virtualInputs = await loadVirtualInputs(inputPaths, virtualKeys, basePath)
    const cssFiles = (gameLoad.css ?? []).map(p => `${basePath}/${p}`)

    return {
        title: gameLoad.title,
        description: gameLoad.description,
        version: gameLoad.version,
        startPage: gameLoad.startPage,
        modules,
        translations,
        virtualKeys,
        virtualInputs,
        css: cssFiles
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
        const bg = load['background-image']
        const moduleDir = `${basePath}/${modulePath}`
        result = {
            type: 'page',
            description: load.description,
            screen: { ...load.screen },
            components,
            backgroundImage: bg ? `${moduleDir}/${bg}` : undefined
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

export async function loadTranslations(path: string, basePath: string = BASE_PATH): Promise<Translations> {
    const index = await loadJsonResource(`${basePath}/${path}/index.json`, translationsIndexSchema)
    const languages: Record<string, LanguageData> = {}
    for (const lang of index.languages) {
        languages[lang] = await loadLanguage(lang, path, basePath)
    }
    return { languages }
}

export async function loadLanguage(lang: string, translationsPath: string, basePath: string = BASE_PATH): Promise<LanguageData> {
    const cacheKey = `${translationsPath}/${lang}`
    const cached = translationCache.get(cacheKey)
    if (cached) {
        return cached
    }
    const data = await loadJsonResource(`${basePath}/${translationsPath}/${lang}/index.json`, languageDataSchema)
    const result: LanguageData = { name: data.name, translations: { ...data.translations } }
    translationCache.set(cacheKey, result)
    return result
}

export async function loadVirtualKeys(paths: string[], basePath: string = BASE_PATH, resourcesBase: string = RESOURCE_PATH): Promise<Record<string, VirtualKey>> {
    const result: Record<string, VirtualKey> = {}

    const mergeKeys = (keys: Array<{ virtualKey: string; keyCode: string; ctrl?: boolean; shift?: boolean; alt?: boolean }>) => {
        keys.forEach(k => {
            const key: VirtualKey = {
                virtualKey: k.virtualKey,
                keyCode: k.keyCode,
                ctrl: k.ctrl ?? false,
                shift: k.shift ?? false,
                alt: k.alt ?? false,
            }
            result[key.virtualKey] = key
            virtualKeyCache.set(key.virtualKey, key)
        })
    }

    const resourceKeys = await loadJsonResource(`${resourcesBase}/input/virtual-keys.json`, VirtualKeysSchema)
    mergeKeys(resourceKeys)

    for (const p of paths) {
        const keys = await loadJsonResource(`${basePath}/${p}/virtual-keys.json`, VirtualKeysSchema)
        mergeKeys(keys)
    }

    return result
}

export async function loadVirtualInputs(paths: string[], virtualKeys: Record<string, VirtualKey>, basePath: string = BASE_PATH, resourcesBase: string = RESOURCE_PATH): Promise<Record<string, VirtualInput>> {
    const result: Record<string, VirtualInput> = {}

    const mergeInputs = (inputs: Array<{ virtualInput: string; virtualKeys: string[]; label: string }>) => {
        inputs.forEach(i => {
            const keys: VirtualKey[] = []
            i.virtualKeys.forEach(k => {
                const key = virtualKeys[k] || virtualKeyCache.get(k)
                if (key) {
                    keys.push(key)
                }
            })
            result[i.virtualInput] = { virtualInput: i.virtualInput, virtualKeys: keys, label: i.label }
        })
    }

    const resourceInputs = await loadJsonResource(`${resourcesBase}/input/virtual-inputs.json`, VirtualInputsSchema)
    mergeInputs(resourceInputs)

    for (const p of paths) {
        let inputs
        try {
            inputs = await loadJsonResource(`${basePath}/${p}/virtual-inputs.json`, VirtualInputsSchema)
        } catch {
            inputs = await loadJsonResource(`${basePath}/${p}/virtual-input.json`, VirtualInputsSchema)
        }
        mergeInputs(inputs)
    }

    return result
}
