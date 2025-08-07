import { useState } from 'react'
import type { Game } from '@loader/data/game'
import type { GameMap } from '@loader/data/map'
import type { Tile } from '@loader/data/tile'
import { resolveTileSet } from '../resolveTileSet'
import { fromAnyMap, toSchemaMap } from '../convertMap'
import type { SquaresMap as SchemaSquaresMap } from '@loader/schema/map'
import {
  saveGame as defaultSaveGame,
  fetchMap as defaultFetchMap,
  fetchTiles as defaultFetchTiles,
} from '../services/api'

export interface UseGameTabsResult {
  tab: 'game' | 'map'
  setTab: React.Dispatch<React.SetStateAction<'game' | 'map'>>
  editingMap: GameMap | null
  editingTiles: Record<string, Tile>
  openMapEditor: (id: string) => Promise<void>
  handleMapSave: (map: GameMap, tiles: Record<string, Tile>) => Promise<void>
}

export function useGameTabs(
  game: Game | null,
  setStatusMessage: React.Dispatch<React.SetStateAction<string>>,
  fetchMap: typeof defaultFetchMap = defaultFetchMap,
  fetchTiles: typeof defaultFetchTiles = defaultFetchTiles,
  saveGame: typeof defaultSaveGame = defaultSaveGame,
): UseGameTabsResult {
  const [tab, setTab] = useState<'game' | 'map'>('game')
  const [editingMap, setEditingMap] = useState<GameMap | null>(null)
  const [editingTiles, setEditingTiles] = useState<Record<string, Tile>>({})
  const [editingMapId, setEditingMapId] = useState<string | null>(null)

  const openMapEditor = async (id: string) => {
    if (!game) return
    const path = game.maps[id]
    let mapData: GameMap
    let tiles: Record<string, Tile> = {}
    try {
      const json = (await fetchMap(path)) as SchemaSquaresMap | GameMap
      mapData = fromAnyMap(json)
      await Promise.all(
        (mapData.tileSets || []).map(async (setId: string) => {
          const tilePath = game.tiles[setId]
          if (!tilePath) return
          try {
            const tJson = (await fetchTiles(tilePath)) as { tiles?: Tile[] }
            if (Array.isArray(tJson.tiles)) {
              Object.assign(tiles, resolveTileSet(tilePath, tJson.tiles))
            }
          } catch {
            // ignore tile loading errors
          }
        }),
      )
    } catch {
      mapData = {
        key: id,
        type: 'squares-map',
        width: 1,
        height: 1,
        tileSets: [],
        tiles: { blank: { key: 'blank', tile: 'blank' } },
        map: [['blank']],
      }
      tiles = {
        blank: { key: 'blank', description: '', color: 'transparent' },
      }
      setStatusMessage('Failed to load map')
    }
    setEditingMapId(id)
    setEditingMap(mapData)
    setEditingTiles(tiles)
    setTab('map')
  }

  const handleMapSave = async (
    map: GameMap,
    tiles: Record<string, Tile>,
  ) => {
    if (!game || !editingMapId) return
    const json = JSON.stringify({ map: toSchemaMap(map), tiles }, null, 2)
    const path = game.maps[editingMapId]
    const message = await saveGame(
      json,
      (_url, options) => fetch(`/api/map/${encodeURIComponent(path)}`, options),
    )
    setStatusMessage(message)
    setTab('game')
  }

  return {
    tab,
    setTab,
    editingMap,
    editingTiles,
    openMapEditor,
    handleMapSave,
  }
}
