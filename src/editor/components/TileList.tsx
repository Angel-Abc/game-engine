import type React from 'react'

interface TileListProps {
  tiles: Record<string, string>
  updateTileId: (oldId: string, newId: string) => void
  updateTilePath: (id: string, path: string) => void
  addTile: () => void
  removeTile: (id: string) => void
}

export const TileList: React.FC<TileListProps> = ({
  tiles,
  updateTileId,
  updateTilePath,
  addTile,
  removeTile,
}) => (
  <section className="editor-section editor-list">
    <h2>Tiles</h2>
    {Object.entries(tiles).map(([id, path]) => (
      <fieldset key={id} className="editor-list-item">
        <input
          type="text"
          value={id}
          onChange={(e) => updateTileId(id, e.target.value)}
        />
        <input
          type="text"
          value={path}
          onChange={(e) => updateTilePath(id, e.target.value)}
        />
        <button type="button" onClick={() => removeTile(id)}>
          Remove
        </button>
      </fieldset>
    ))}
    <button type="button" onClick={addTile}>
      Add Tile
    </button>
  </section>
)

