import type React from 'react'
import type { EditableMapActions } from './useEditableList'
import { useMapKeys } from './useMapKeys'

interface MapListProps extends EditableMapActions {
  maps: Record<string, string>
  onEdit?: (id: string) => void
}

export const MapList: React.FC<MapListProps> = ({
  maps,
  updateId,
  updateItem,
  addItem,
  removeItem,
  onEdit,
}) => {
  const { getKey, updateId: updateKey, removeId } = useMapKeys(
    Object.keys(maps),
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
      <h2>Maps</h2>
      {Object.entries(maps).map(([id, path]) => (
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
          <button type="button" onClick={() => onEdit?.(id)}>
            Edit
          </button>
          <button type="button" onClick={() => handleRemove(id)}>
            Remove
          </button>
        </fieldset>
      ))}
      <button type="button" onClick={addItem}>
        Add Map
      </button>
    </section>
  )
}

