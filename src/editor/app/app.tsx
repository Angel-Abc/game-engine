import React, { useState } from 'react'
import { GameTree } from './gameTree'
import { GameEditor } from './gameEditor'
import { CreatePageForm } from '../pages/createPageForm'
import { useGameData } from '../hooks/useGameData'
import styles from './app.module.css'

export const App: React.FC = (): React.JSX.Element => {
  const game = useGameData()
  const [selected, setSelected] = useState<string | null>(null)
  const [status, setStatus] = useState('idle')

  const handleSave = (): void => {
    setStatus('saved')
  }

  return (
    <div className={styles.app}>
      <div className={styles.header}>
        <span>Status: {status}</span>
        <button onClick={handleSave}>Save</button>
      </div>
      <div className={styles.main}>
        <div className={styles.sidebar}>
          <GameTree game={game} onSelect={setSelected} />
        </div>
        <div className={styles.content}>
          {selected === 'root' && game ? <GameEditor game={game} /> : null}
          {selected === 'pages' ? <CreatePageForm /> : null}
        </div>
      </div>
    </div>
  )
}

