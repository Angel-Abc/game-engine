import React from 'react'
import { GameTree } from './gameTree'
import { useGameData } from '../hooks/useGameData'

export const App: React.FC = (): React.JSX.Element => {
  const game = useGameData()

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
        <GameTree game={game} />
      </div>
      <div style={{ flex: 1 }} />
    </div>
  )
}

