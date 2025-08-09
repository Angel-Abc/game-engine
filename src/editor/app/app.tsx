import React, { useState } from 'react'
import { GameTree } from './gameTree'
import { GameEditor } from './gameEditor'
import { CreatePageForm } from '../pages/createPageForm'
import { useGameData } from '../hooks/useGameData'

export const App: React.FC = (): React.JSX.Element => {
  const game = useGameData()
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div
        style={{
          width: '250px',
          borderRight: '1px solid #ccc',
          padding: '0.5rem',
          overflowY: 'auto',
        }}
      >
        <GameTree game={game} onSelect={setSelected} />
      </div>
      <div style={{ flex: 1, padding: '0.5rem', overflowY: 'auto' }}>
        {selected === 'root' && game ? <GameEditor game={game} /> : null}
        {selected === 'pages' ? <CreatePageForm /> : null}
      </div>
    </div>
  )
}

