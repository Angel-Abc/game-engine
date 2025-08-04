import { useCallback } from 'react'
import type React from 'react'
import { MapViewport } from './MapViewport'
import { useMapEditor } from './useMapEditor'

export const MapEditor: React.FC = () => {
  const {
    map,
    tiles,
    selectedTile,
    tool,
    canUndo,
    canRedo,
    setSelectedTile,
    setTool,
    loadFromJSON,
    saveToJSON,
    placeTile,
    undo,
    redo,
  } = useMapEditor()

  const handleLoad = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const text = reader.result
      if (typeof text === 'string') {
        loadFromJSON(text)
      }
    }
    reader.readAsText(file)
  }, [loadFromJSON])

  const handleSave = useCallback(() => {
    const json = saveToJSON()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${map?.key ?? 'map'}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [saveToJSON, map])

  const handleTileClick = useCallback((x: number, y: number) => {
    placeTile(x, y)
  }, [placeTile])

  return (
    <section className="editor-section">
      <h2>Map Editor</h2>
      <div className="editor-list">
        <input type="file" accept="application/json" onChange={handleLoad} />
        <div>
          <button type="button" onClick={handleSave} disabled={!map}>
            Save
          </button>
          <button type="button" onClick={undo} disabled={!canUndo}>
            Undo
          </button>
          <button type="button" onClick={redo} disabled={!canRedo}>
            Redo
          </button>
          <label>
            <input
              type="radio"
              name="tool"
              value="brush"
              checked={tool === 'brush'}
              onChange={() => setTool('brush')}
            />
            Brush
          </label>
          <label>
            <input
              type="radio"
              name="tool"
              value="fill"
              checked={tool === 'fill'}
              onChange={() => setTool('fill')}
            />
            Fill
          </label>
        </div>
      </div>
      {map && (
        <div className="editor-list">
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {Object.values(map.tiles).map((mt) => {
              const tile = tiles[mt.tile]
              const style: React.CSSProperties = {
                width: '32px',
                height: '32px',
                backgroundColor: tile.color || 'transparent',
                border: mt.key === selectedTile ? '2px solid red' : '1px solid #ccc',
                padding: 0,
              }
              return (
                <button
                  key={mt.key}
                  type="button"
                  style={style}
                  onClick={() => setSelectedTile(mt.key)}
                >
                  {tile.image && (
                    <img src={tile.image} alt={mt.key} style={{ width: '100%', height: '100%' }} />
                  )}
                </button>
              )
            })}
          </div>
          <div style={{ position: 'relative', width: 'fit-content' }}>
            <MapViewport map={map} tiles={tiles} />
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'grid',
                gridTemplateColumns: `repeat(${map.width}, 1fr)`,
                gridTemplateRows: `repeat(${map.height}, 1fr)`,
              }}
            >
              {map.map.map((row, y) =>
                row.map((_, x) => (
                  <div
                    key={`${x}-${y}`}
                    onClick={() => handleTileClick(x, y)}
                    style={{ cursor: 'pointer' }}
                  />
                )),
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

