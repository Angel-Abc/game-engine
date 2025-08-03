import type React from 'react'

interface VirtualInputListProps {
  virtualInputs: string[]
  updateVirtualInput: (index: number, value: string) => void
  addVirtualInput: () => void
  removeVirtualInput: (index: number) => void
}

export const VirtualInputList: React.FC<VirtualInputListProps> = ({
  virtualInputs,
  updateVirtualInput,
  addVirtualInput,
  removeVirtualInput,
}) => (
  <section className="editor-section editor-list">
    <h2>Virtual Inputs</h2>
    {virtualInputs.map((input, index) => (
      <fieldset key={index} className="editor-list-item">
        <input
          type="text"
          value={input}
          onChange={(e) => updateVirtualInput(index, e.target.value)}
        />
        <button type="button" onClick={() => removeVirtualInput(index)}>
          Remove
        </button>
      </fieldset>
    ))}
    <button type="button" onClick={addVirtualInput}>
      Add Virtual Input
    </button>
  </section>
)

