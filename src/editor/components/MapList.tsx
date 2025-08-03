import React from 'react'
import type { EditableMapActions } from './useEditableList'
import { MapEditor } from './MapEditor'

interface MapListProps extends EditableMapActions {
  maps: Record<string, string>
  tiles: string[]
}

export const MapList: React.FC<MapListProps> = ({
  maps,
  tiles,
  updateId,
  updateItem,
  addItem,
  removeItem,
}) => (
  <section className="editor-section editor-list">
    <h2>Maps</h2>
    {Object.entries(maps).map(([id, json]) => (
      <fieldset key={id} className="editor-list-item">
        <input
          type="text"
          value={id}
          onChange={(e) => updateId(id, e.target.value)}
        />
        <MapEditor
          value={json}
          tiles={tiles}
          onChange={(val) => updateItem(id, val)}
        />
        <button type="button" onClick={() => removeItem(id)}>
          Remove
        </button>
      </fieldset>
    ))}
    <button type="button" onClick={addItem}>
      Add Map
    </button>
  </section>
)

