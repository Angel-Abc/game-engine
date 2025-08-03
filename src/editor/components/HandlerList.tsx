import type React from 'react'
import type { EditableArrayActions } from './useEditableList'

interface HandlerListProps extends EditableArrayActions {
  handlers: string[]
}

export const HandlerList: React.FC<HandlerListProps> = ({
  handlers,
  updateItem,
  addItem,
  removeItem,
}) => (
  <section className="editor-section editor-list">
    <h2>Handlers</h2>
    {handlers.map((handler, index) => (
      <fieldset key={index} className="editor-list-item">
        <input
          type="text"
          value={handler}
          onChange={(e) => updateItem(index, e.target.value)}
        />
        <button type="button" onClick={() => removeItem(index)}>
          Remove
        </button>
      </fieldset>
    ))}
    <button type="button" onClick={addItem}>
      Add Handler
    </button>
  </section>
)

