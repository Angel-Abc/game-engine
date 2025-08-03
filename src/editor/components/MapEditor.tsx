import React, { useEffect, useState } from 'react'

interface MapEditorProps {
  value: string
  tiles: string[]
  onChange: (value: string) => void
}

interface MapData {
  width: number
  height: number
  map: string[][]
}

const createDefaultMap = (): MapData => ({
  width: 5,
  height: 5,
  map: Array.from({ length: 5 }, () => Array(5).fill('')),
})

export const MapEditor: React.FC<MapEditorProps> = ({
  value,
  tiles,
  onChange,
}) => {
  const [mapData, setMapData] = useState<MapData>(() => {
    try {
      const parsed = JSON.parse(value) as MapData
      if (Array.isArray(parsed.map)) return parsed
    } catch {
      /* ignore */
    }
    return createDefaultMap()
  })

  useEffect(() => {
    try {
      const parsed = JSON.parse(value) as MapData
      if (Array.isArray(parsed.map)) {
        setMapData(parsed)
        return
      }
    } catch {
      /* ignore */
    }
    setMapData(createDefaultMap())
  }, [value])

  const [selectedTile, setSelectedTile] = useState(tiles[0] ?? '')

  useEffect(() => {
    setSelectedTile((prev) => (tiles.includes(prev) ? prev : tiles[0] ?? ''))
  }, [tiles])

  const setCell = (x: number, y: number) => {
    setMapData((curr) => {
      const map = curr.map.map((row) => [...row])
      map[y][x] = selectedTile
      const updated = { ...curr, map }
      onChange(JSON.stringify(updated))
      return updated
    })
  }

  return (
    <div>
      <select
        className="tile-picker"
        value={selectedTile}
        onChange={(e) => setSelectedTile(e.target.value)}
      >
        {tiles.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
      <div className="map-grid">
        {mapData.map.map((row, y) => (
          <div key={y} className="map-row">
            {row.map((cell, x) => (
              <button
                type="button"
                key={x}
                className="map-cell"
                onClick={() => setCell(x, y)}
              >
                {cell || '.'}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
