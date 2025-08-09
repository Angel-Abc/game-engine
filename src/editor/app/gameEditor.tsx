import React, { useState } from 'react'
import type { GameData } from '../types'

export const GameEditor: React.FC<{ game: GameData }> = ({ game }) => {
  const [title, setTitle] = useState(game.title)
  const [description, setDescription] = useState(game.description ?? '')
  const [version, setVersion] = useState(game.version ?? '')
  const [initialData, setInitialData] = useState(
    JSON.stringify(game['initial-data'] ?? {}, null, 2)
  )

  return (
    <form style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <label>
        Title
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>
      <label>
        Description
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>
      <label>
        Version
        <input
          type="text"
          value={version}
          onChange={(e) => setVersion(e.target.value)}
        />
      </label>
      <label>
        Initial Data
        <textarea
          value={initialData}
          onChange={(e) => setInitialData(e.target.value)}
          style={{ fontFamily: 'monospace' }}
        />
      </label>
    </form>
  )
}
