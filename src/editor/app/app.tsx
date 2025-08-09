import React, { useEffect, useState } from 'react'
import { GameTree } from './gameTree'

interface GameData {
  title: string
  pages?: Record<string, unknown>
  maps?: Record<string, unknown>
  tiles?: Record<string, unknown>
  dialogs?: Record<string, unknown>
}

export const App: React.FC = (): React.JSX.Element => {
  const [game, setGame] = useState<GameData | null>(null)

  useEffect(() => {
    fetch('/api/game')
      .then((res) => res.json())
      .then((data) => setGame(data))
      .catch(() => setGame(null))
  }, [])

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

