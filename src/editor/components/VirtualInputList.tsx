import type React from 'react'
import type { EditableArrayActions } from './useEditableList'

interface VirtualInputListProps extends EditableArrayActions {
  virtualInputs: string[]
}

export const VirtualInputList: React.FC<VirtualInputListProps> = ({
  virtualInputs,
  updateItem,
  addItem,
  removeItem,
}) => (
  <section className="editor-section editor-list">
    <h2>Virtual Inputs</h2>
    {virtualInputs.map((input, index) => (
      <fieldset key={index} className="editor-list-item">
        <input
          type="text"
          value={input}
          onChange={(e) => updateItem(index, e.target.value)}
        />
        <button type="button" onClick={() => removeItem(index)}>
          Remove
        </button>
      </fieldset>
    ))}
    <button type="button" onClick={addItem}>
      Add Virtual Input
    </button>
  </section>
)

