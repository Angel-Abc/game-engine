import type React from 'react'
import type { EditableArrayActions } from './useEditableList'

interface VirtualKeyListProps extends EditableArrayActions {
  virtualKeys: string[]
}

export const VirtualKeyList: React.FC<VirtualKeyListProps> = ({
  virtualKeys,
  updateItem,
  addItem,
  removeItem,
}) => (
  <section className="editor-section editor-list">
    <h2>Virtual Keys</h2>
    {virtualKeys.map((key, index) => (
      <fieldset key={index} className="editor-list-item">
        <input
          type="text"
          value={key}
          onChange={(e) => updateItem(index, e.target.value)}
        />
        <button type="button" onClick={() => removeItem(index)}>
          Remove
        </button>
      </fieldset>
    ))}
    <button type="button" onClick={addItem}>
      Add Virtual Key
    </button>
  </section>
)

