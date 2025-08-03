import type React from 'react'
import type { EditableMapActions } from './useEditableList'

interface TileListProps extends EditableMapActions {
  tiles: Record<string, string>
}

export const TileList: React.FC<TileListProps> = ({
  tiles,
  updateId,
  updateItem,
  addItem,
  removeItem,
}) => (
  <section className="editor-section editor-list">
    <h2>Tiles</h2>
    {Object.entries(tiles).map(([id, path]) => (
      <fieldset key={id} className="editor-list-item">
        <input
          type="text"
          value={id}
          onChange={(e) => updateId(id, e.target.value)}
        />
        <input
          type="text"
          value={path}
          onChange={(e) => updateItem(id, e.target.value)}
        />
        <button type="button" onClick={() => removeItem(id)}>
          Remove
        </button>
      </fieldset>
    ))}
    <button type="button" onClick={addItem}>
      Add Tile
    </button>
  </section>
)

