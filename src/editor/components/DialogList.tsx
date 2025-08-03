import type React from 'react'
import type { EditableMapActions } from './useEditableList'

interface DialogListProps extends EditableMapActions {
  dialogs: Record<string, string>
}

export const DialogList: React.FC<DialogListProps> = ({
  dialogs,
  updateId,
  updateItem,
  addItem,
  removeItem,
}) => (
  <section className="editor-section editor-list">
    <h2>Dialogs</h2>
    {Object.entries(dialogs).map(([id, path]) => (
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
    <button type="button" onClick={addItem}>Add Dialog</button>
  </section>
)

