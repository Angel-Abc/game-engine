import type React from 'react'

interface VirtualKeyListProps {
  virtualKeys: string[]
  updateVirtualKey: (index: number, value: string) => void
  addVirtualKey: () => void
  removeVirtualKey: (index: number) => void
}

export const VirtualKeyList: React.FC<VirtualKeyListProps> = ({
  virtualKeys,
  updateVirtualKey,
  addVirtualKey,
  removeVirtualKey,
}) => (
  <section className="editor-section editor-list">
    <h2>Virtual Keys</h2>
    {virtualKeys.map((key, index) => (
      <fieldset key={index} className="editor-list-item">
        <input
          type="text"
          value={key}
          onChange={(e) => updateVirtualKey(index, e.target.value)}
        />
        <button type="button" onClick={() => removeVirtualKey(index)}>
          Remove
        </button>
      </fieldset>
    ))}
    <button type="button" onClick={addVirtualKey}>
      Add Virtual Key
    </button>
  </section>
)

