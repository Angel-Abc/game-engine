import type { Module } from './module'
import type { Translations } from './translation'
import type { VirtualKey, VirtualInput } from './virtualInput'
import type { Tile } from './tile'

export interface GameData {
    title: string
    description: string
    version: string
    startPage: string
    modules: Record<string, Module>
    translations: Translations
    virtualKeys: Record<string, VirtualKey>
    virtualInputs: Record<string, VirtualInput>
    css: string[]
    tiles: Record<string, Tile>
}
