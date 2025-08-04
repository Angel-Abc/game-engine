import type React from 'react'
import type { EditableMapActions } from './useEditableList'
import { useMapKeys } from './useMapKeys'

interface LanguageListProps extends EditableMapActions<string[]> {
  languages: Record<string, string[]>
}

export const LanguageList: React.FC<LanguageListProps> = ({
  languages,
  updateId,
  updateItem,
  addItem,
  removeItem,
}) => {
  const { getKey, updateId: updateKey, removeId } = useMapKeys(
    Object.keys(languages),
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
      <h2>Languages</h2>
      {Object.entries(languages).map(([id, paths]) => (
        <fieldset key={getKey(id)} className="editor-list-item">
          <input
            type="text"
            value={id}
            onChange={(e) => handleUpdateId(id, e.target.value)}
          />
          <input
            type="text"
            value={paths.join(', ')}
            onChange={(e) =>
              updateItem(
                id,
                e.target.value
                  .split(',')
                  .map((p) => p.trim())
                  .filter((p) => p.length > 0),
              )
            }
          />
          <button type="button" onClick={() => handleRemove(id)}>
            Remove
          </button>
        </fieldset>
      ))}
      <button type="button" onClick={addItem}>
        Add Language
      </button>
    </section>
  )
}

