import type React from 'react'

interface LanguageListProps {
  languages: Record<string, string>
  updateLanguageId: (oldId: string, newId: string) => void
  updateLanguagePath: (id: string, path: string) => void
  addLanguage: () => void
  removeLanguage: (id: string) => void
}

export const LanguageList: React.FC<LanguageListProps> = ({
  languages,
  updateLanguageId,
  updateLanguagePath,
  addLanguage,
  removeLanguage,
}) => (
  <section className="editor-section editor-list">
    <h2>Languages</h2>
    {Object.entries(languages).map(([id, path]) => (
      <fieldset key={id} className="editor-list-item">
        <input
          type="text"
          value={id}
          onChange={(e) => updateLanguageId(id, e.target.value)}
        />
        <input
          type="text"
          value={path}
          onChange={(e) => updateLanguagePath(id, e.target.value)}
        />
        <button type="button" onClick={() => removeLanguage(id)}>
          Remove
        </button>
      </fieldset>
    ))}
    <button type="button" onClick={addLanguage}>
      Add Language
    </button>
  </section>
)

