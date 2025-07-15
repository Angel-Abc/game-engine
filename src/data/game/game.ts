import type { Module } from './module'

export interface GameData {
    title: string
    description: string
    modules: Record<string, Module>
}
