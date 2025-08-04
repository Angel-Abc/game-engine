import type React from 'react'
import type { EditableMapActions } from './useEditableList'
import { useMapKeys } from './useMapKeys'

interface TileListProps extends EditableMapActions {
  tiles: Record<string, string>
}

export const TileList: React.FC<TileListProps> = ({
  tiles,
  updateId,
  updateItem,
  addItem,
  removeItem,
}) => {
  const { getKey, updateId: updateKey, removeId } = useMapKeys(
    Object.keys(tiles),
  )

  const handleUpdateId = (oldId: string, newId: string) => {
    updateKey(oldId, newId)
    updateId(oldId, newId)
  }

  const handleRemove = (id: string) => {
    removeId(id)
    removeItem(id)
  }

  return (
    <section className="editor-section editor-list">
      <h2>Tiles</h2>
      {Object.entries(tiles).map(([id, path]) => (
        <fieldset key={getKey(id)} className="editor-list-item">
          <input
            type="text"
            value={id}
            onChange={(e) => handleUpdateId(id, e.target.value)}
          />
          <input
            type="text"
            value={path}
            onChange={(e) => updateItem(id, e.target.value)}
          />
          <button type="button" onClick={() => handleRemove(id)}>
            Remove
          </button>
        </fieldset>
      ))}
      <button type="button" onClick={addItem}>
        Add Tile
      </button>
    </section>
  )
}

