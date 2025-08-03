import type React from 'react'
import type { EditableMapActions } from './useEditableList'

interface PageListProps extends EditableMapActions {
  pages: Record<string, string>
}

export const PageList: React.FC<PageListProps> = ({
  pages,
  updateId,
  updateItem,
  addItem,
  removeItem,
}) => (
  <section className="editor-section editor-list">
    <h2>Pages</h2>
    {Object.entries(pages).map(([id, path]) => (
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
    <button type="button" onClick={addItem}>Add Page</button>
  </section>
)

