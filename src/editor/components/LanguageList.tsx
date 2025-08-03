import type React from 'react'
import type { EditableMapActions } from './useEditableList'

interface LanguageListProps extends EditableMapActions<string[]> {
  languages: Record<string, string[]>
}

export const LanguageList: React.FC<LanguageListProps> = ({
  languages,
  updateId,
  updateItem,
  addItem,
  removeItem,
}) => (
  <section className="editor-section editor-list">
    <h2>Languages</h2>
    {Object.entries(languages).map(([id, paths]) => (
      <fieldset key={id} className="editor-list-item">
        <input
          type="text"
          value={id}
          onChange={(e) => updateId(id, e.target.value)}
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
        <button type="button" onClick={() => removeItem(id)}>
          Remove
        </button>
      </fieldset>
    ))}
    <button type="button" onClick={addItem}>
      Add Language
    </button>
  </section>
)

