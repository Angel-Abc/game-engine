import React, { useEffect, useState } from 'react'
import type { EditableMapActions } from './useEditableList'

interface MapListProps extends EditableMapActions {
  maps: Record<string, string>
  tiles: string[]
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

const MapEditor: React.FC<{
  value: string
  tiles: string[]
  onChange: (value: string) => void
}> = ({ value, tiles, onChange }) => {
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

export const MapList: React.FC<MapListProps> = ({
  maps,
  tiles,
  updateId,
  updateItem,
  addItem,
  removeItem,
}) => (
  <section className="editor-section editor-list">
    <h2>Maps</h2>
    {Object.entries(maps).map(([id, json]) => (
      <fieldset key={id} className="editor-list-item">
        <input
          type="text"
          value={id}
          onChange={(e) => updateId(id, e.target.value)}
        />
        <MapEditor
          value={json}
          tiles={tiles}
          onChange={(val) => updateItem(id, val)}
        />
        <button type="button" onClick={() => removeItem(id)}>
          Remove
        </button>
      </fieldset>
    ))}
    <button type="button" onClick={addItem}>
      Add Map
    </button>
  </section>
)

