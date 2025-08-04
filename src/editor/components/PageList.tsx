import type React from 'react'
import type { EditableMapActions } from './useEditableList'
import { useMapKeys } from './useMapKeys'

interface PageListProps extends EditableMapActions {
  pages: Record<string, string>
}

export const PageList: React.FC<PageListProps> = ({
  pages,
  updateId,
  updateItem,
  addItem,
  removeItem,
}) => {
  const { getKey, updateId: updateKey, removeId } = useMapKeys(
    Object.keys(pages),
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
      <h2>Pages</h2>
      {Object.entries(pages).map(([id, path]) => (
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
      <button type="button" onClick={addItem}>Add Page</button>
    </section>
  )
}

