import type React from 'react'

interface StylingListProps {
  styling: string[]
  updateStyling: (index: number, value: string) => void
  addStyling: () => void
  removeStyling: (index: number) => void
}

export const StylingList: React.FC<StylingListProps> = ({
  styling,
  updateStyling,
  addStyling,
  removeStyling,
}) => (
  <section className="editor-section editor-list">
    <h2>Styling</h2>
    {styling.map((path, index) => (
      <fieldset key={index} className="editor-list-item">
        <input
          type="text"
          value={path}
          onChange={(e) => updateStyling(index, e.target.value)}
        />
        <button type="button" onClick={() => removeStyling(index)}>
          Remove
        </button>
      </fieldset>
    ))}
    <button type="button" onClick={addStyling}>
      Add Styling
    </button>
  </section>
)

