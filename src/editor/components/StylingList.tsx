import type React from 'react'
import type { EditableArrayActions } from './useEditableList'

interface StylingListProps extends EditableArrayActions {
  styling: string[]
}

export const StylingList: React.FC<StylingListProps> = ({
  styling,
  updateItem,
  addItem,
  removeItem,
}) => (
  <section className="editor-section editor-list">
    <h2>Styling</h2>
    {styling.map((path, index) => (
      <fieldset key={index} className="editor-list-item">
        <input
          type="text"
          value={path}
          onChange={(e) => updateItem(index, e.target.value)}
        />
        <button type="button" onClick={() => removeItem(index)}>
          Remove
        </button>
      </fieldset>
    ))}
    <button type="button" onClick={addItem}>
      Add Styling
    </button>
  </section>
)

