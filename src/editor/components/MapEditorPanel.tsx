import type React from 'react'
import type { GameMap } from '@loader/data/map'
import type { Tile } from '@loader/data/tile'
import { MapEditor } from './MapEditor'

interface MapEditorPanelProps {
  map: GameMap
  tiles: Record<string, Tile>
  onSave: (map: GameMap, tiles: Record<string, Tile>) => void
  onCancel: () => void
}

export const MapEditorPanel: React.FC<MapEditorPanelProps> = ({
  map,
  tiles,
  onSave,
  onCancel,
}) => (
  <MapEditor map={map} tiles={tiles} onSave={onSave} onCancel={onCancel} />
)
