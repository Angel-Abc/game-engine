import React, { useEffect, useState } from 'react'
import { GameTree } from './gameTree'
import { GameEditor } from './gameEditor'
import { CreatePageForm } from '../pages/createPageForm'
import { PageEditor } from '../pages/pageEditor'
import { useGameData } from '../hooks/useGameData'
import type { GameData } from '../types'
import styles from './app.module.css'

export const App: React.FC = (): React.JSX.Element => {
  const fetchedGame = useGameData()
  const [game, setGame] = useState<GameData | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const [status, setStatus] = useState('idle')

  useEffect(() => {
    if (fetchedGame) {
      setGame(fetchedGame)
    }
  }, [fetchedGame])

  const handleSave = (): void => {
    setStatus('saved')
  }

  const handlePageApply = (page: unknown): void => {
    if (!game || !selected?.startsWith('pages/')) return
    const pageId = selected.split('/')[1]
    setGame({
      ...game,
      pages: {
        ...(game.pages ?? {}),
        [pageId]: page,
      },
    })
  }

  return (
    <div className={styles.app}>
      <div className={styles.main}>
        <div className={styles.sidebar}>
          <GameTree game={game} onSelect={setSelected} />
        </div>
        <div className={styles.content}>
          <div className={styles.header}>
            <span>Status: {status}</span>
            <button onClick={handleSave}>Save</button>
          </div>
          {selected === 'root' && game ? <GameEditor game={game} /> : null}
          {selected === 'pages' ? <CreatePageForm /> : null}
          {selected?.startsWith('pages/') && game ? (
            <PageEditor
              data={game.pages?.[selected.split('/')[1]]}
              onApply={handlePageApply}
            />
          ) : null}
        </div>
      </div>
    </div>
  )
}

