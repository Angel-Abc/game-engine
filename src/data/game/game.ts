import type { Module } from './module'
import type { Translations } from './translation'

export interface GameData {
    title: string
    description: string
    modules: Record<string, Module>
    translations: Translations
}
