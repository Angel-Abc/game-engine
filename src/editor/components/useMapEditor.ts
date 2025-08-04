import { useCallback, useState } from 'react'
import type { GameMap } from '@loader/data/map'
import type { Tile } from '@loader/data/tile'

export interface UseMapEditorOptions {
  map?: GameMap
  tiles?: Record<string, Tile>
}

export interface MapEditorState {
  map: GameMap | null
  tiles: Record<string, Tile>
  selectedTile: string
  tool: 'brush' | 'fill'
  canUndo: boolean
  canRedo: boolean
}

export interface MapEditorActions {
  setSelectedTile: (key: string) => void
  setTool: (tool: 'brush' | 'fill') => void
  loadFromJSON: (json: string) => void
  saveToJSON: () => string
  placeTile: (x: number, y: number) => void
  undo: () => void
  redo: () => void
}

export function useMapEditor(options: UseMapEditorOptions = {}): MapEditorState & MapEditorActions {
  const [map, setMap] = useState<GameMap | null>(options.map ?? null)
  const [tiles, setTiles] = useState<Record<string, Tile>>(options.tiles ?? {})
  const [selectedTile, setSelectedTile] = useState('')
  const [tool, setTool] = useState<'brush' | 'fill'>('brush')
  const [undoStack, setUndoStack] = useState<GameMap[]>([])
  const [redoStack, setRedoStack] = useState<GameMap[]>([])

  const loadFromJSON = useCallback((json: string) => {
    const data = JSON.parse(json) as { map: GameMap; tiles: Record<string, Tile> }
    setMap(data.map)
    setTiles(data.tiles)
    setSelectedTile('')
    setUndoStack([])
    setRedoStack([])
  }, [])

  const saveToJSON = useCallback(() => {
    return JSON.stringify({ map, tiles }, null, 2)
  }, [map, tiles])

  const pushHistory = useCallback(
    (newMap: GameMap) => {
      setUndoStack((curr) => (map ? [...curr, map] : curr))
      setRedoStack([])
      setMap(newMap)
    },
    [map],
  )

  const brush = useCallback(
    (x: number, y: number) => {
      if (!map || !selectedTile) return
      const newMap: GameMap = { ...map, map: map.map.map((row) => [...row]) }
      newMap.map[y][x] = selectedTile
      pushHistory(newMap)
    },
    [map, selectedTile, pushHistory],
  )

  const fill = useCallback(
    (x: number, y: number) => {
      if (!map || !selectedTile) return
      const target = map.map[y][x]
      if (target === selectedTile) return
      const newMap: GameMap = { ...map, map: map.map.map((row) => [...row]) }
      const width = map.width
      const height = map.height
      const stack: Array<{ x: number; y: number }> = [{ x, y }]
      while (stack.length) {
        const { x: cx, y: cy } = stack.pop()!
        if (cx < 0 || cy < 0 || cx >= width || cy >= height) continue
        if (newMap.map[cy][cx] !== target) continue
        newMap.map[cy][cx] = selectedTile
        stack.push({ x: cx + 1, y: cy })
        stack.push({ x: cx - 1, y: cy })
        stack.push({ x: cx, y: cy + 1 })
        stack.push({ x: cx, y: cy - 1 })
      }
      pushHistory(newMap)
    },
    [map, selectedTile, pushHistory],
  )

  const placeTile = useCallback(
    (x: number, y: number) => {
      if (tool === 'fill') fill(x, y)
      else brush(x, y)
    },
    [tool, brush, fill],
  )

  const undo = useCallback(() => {
    setUndoStack((curr) => {
      if (curr.length === 0) return curr
      const prev = curr[curr.length - 1]
      setRedoStack((r) => (map ? [...r, map] : r))
      setMap(prev)
      return curr.slice(0, -1)
    })
  }, [map])

  const redo = useCallback(() => {
    setRedoStack((curr) => {
      if (curr.length === 0) return curr
      const next = curr[curr.length - 1]
      setUndoStack((u) => (map ? [...u, map] : u))
      setMap(next)
      return curr.slice(0, -1)
    })
  }, [map])

  return {
    map,
    tiles,
    selectedTile,
    tool,
    canUndo: undoStack.length > 0,
    canRedo: redoStack.length > 0,
    setSelectedTile,
    setTool,
    loadFromJSON,
    saveToJSON,
    placeTile,
    undo,
    redo,
  }
}

