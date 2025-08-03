import type React from 'react'

interface HandlerListProps {
  handlers: string[]
  updateHandler: (index: number, value: string) => void
  addHandler: () => void
  removeHandler: (index: number) => void
}

export const HandlerList: React.FC<HandlerListProps> = ({
  handlers,
  updateHandler,
  addHandler,
  removeHandler,
}) => (
  <section className="editor-section editor-list">
    <h2>Handlers</h2>
    {handlers.map((handler, index) => (
      <fieldset key={index} className="editor-list-item">
        <input
          type="text"
          value={handler}
          onChange={(e) => updateHandler(index, e.target.value)}
        />
        <button type="button" onClick={() => removeHandler(index)}>
          Remove
        </button>
      </fieldset>
    ))}
    <button type="button" onClick={addHandler}>
      Add Handler
    </button>
  </section>
)

