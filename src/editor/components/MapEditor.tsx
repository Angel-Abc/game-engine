import { useState, useEffect, useMemo } from 'react'
import { useEditorContext } from '@editor/context/EditorContext'
import type { MapData } from '@editor/data/map'

export interface MapEditorProps {
  id: string
}

export const MapEditor: React.FC<MapEditorProps> = ({ id }) => {
  const { game, setGame } = useEditorContext()
  const [selected, setSelected] = useState<string>('')
  const [painting, setPainting] = useState(false)

  if (!game) {
    return null
  }

  const map = game.maps[id] as MapData | undefined
  const width = map?.width ?? 0
  const height = map?.height ?? 0

  const currentMap: string[][] = useMemo(
    () =>
      map?.map && map.map.length === height && (map.map[0]?.length ?? 0) === width
        ? map.map
        : Array.from({ length: height }, () => Array(width).fill('')),
    [map, width, height],
  )

  useEffect(() => {
    if (
      !map?.map ||
      map.map.length !== height ||
      (map.map[0]?.length ?? 0) !== width
    ) {
      setGame({
        ...game,
        maps: { ...game.maps, [id]: { ...map, width, height, map: currentMap } },
      })
    }
  }, [game, id, width, height, map, currentMap, setGame])

  const tiles = Object.keys(game.tiles)

  const placeTile = (x: number, y: number) => {
    const newMap = currentMap.map((row) => [...row])
    newMap[y][x] = selected
    setGame({
      ...game,
      maps: { ...game.maps, [id]: { ...map, width, height, map: newMap } },
    })
  }

  const handleMouseDown = (x: number, y: number) => () => {
    placeTile(x, y)
    setPainting(true)
  }

  const handleMouseEnter = (x: number, y: number) => () => {
    if (painting) {
      placeTile(x, y)
    }
  }

  const handleMouseUp = () => {
    setPainting(false)
  }

  return (
    <div onMouseUp={handleMouseUp}>
      <div style={{ marginBottom: '0.5rem' }}>
        {tiles.map((key) => (
          <button
            type="button"
            key={key}
            data-tile={key}
            onClick={() => setSelected(key)}
            style={{
              marginRight: '0.25rem',
              border: selected === key ? '2px solid #000' : '1px solid #ccc',
            }}
          >
            {key}
          </button>
        ))}
      </div>
      <div
        className="map-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${width}, 32px)`,
          gridTemplateRows: `repeat(${height}, 32px)`,
          gap: '1px',
        }}
      >
        {currentMap.map((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${x}-${y}`}
              data-cell={`${x}-${y}`}
              onMouseDown={handleMouseDown(x, y)}
              onMouseEnter={handleMouseEnter(x, y)}
              style={{
                width: 32,
                height: 32,
                border: '1px solid #999',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: cell ? '#eee' : '#fff',
              }}
            >
              {cell}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default MapEditor
