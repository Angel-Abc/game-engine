import type React from 'react'

interface MapListProps {
  maps: Record<string, string>
  updateMapId: (oldId: string, newId: string) => void
  updateMapPath: (id: string, path: string) => void
  addMap: () => void
  removeMap: (id: string) => void
}

export const MapList: React.FC<MapListProps> = ({
  maps,
  updateMapId,
  updateMapPath,
  addMap,
  removeMap,
}) => (
  <section className="editor-section editor-list">
    <h2>Maps</h2>
    {Object.entries(maps).map(([id, path]) => (
      <fieldset key={id} className="editor-list-item">
        <input
          type="text"
          value={id}
          onChange={(e) => updateMapId(id, e.target.value)}
        />
        <input
          type="text"
          value={path}
          onChange={(e) => updateMapPath(id, e.target.value)}
        />
        <button type="button" onClick={() => removeMap(id)}>
          Remove
        </button>
      </fieldset>
    ))}
    <button type="button" onClick={addMap}>
      Add Map
    </button>
  </section>
)

