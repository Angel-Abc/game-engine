import type React from 'react'

interface PageListProps {
  pages: Record<string, string>
  updatePageId: (oldId: string, newId: string) => void
  updatePagePath: (id: string, path: string) => void
  addPage: () => void
  removePage: (id: string) => void
}

export const PageList: React.FC<PageListProps> = ({
  pages,
  updatePageId,
  updatePagePath,
  addPage,
  removePage,
}) => (
  <section className="editor-section editor-list">
    <h2>Pages</h2>
    {Object.entries(pages).map(([id, path]) => (
      <fieldset key={id} className="editor-list-item">
        <input
          type="text"
          value={id}
          onChange={(e) => updatePageId(id, e.target.value)}
        />
        <input
          type="text"
          value={path}
          onChange={(e) => updatePagePath(id, e.target.value)}
        />
        <button type="button" onClick={() => removePage(id)}>
          Remove
        </button>
      </fieldset>
    ))}
    <button type="button" onClick={addPage}>Add Page</button>
  </section>
)

