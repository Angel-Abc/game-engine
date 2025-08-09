import React from 'react'
import { GameTree } from './gameTree'
import { GameEditor } from './gameEditor'
import { CreatePageForm } from '../pages/createPageForm'
import { PageEditor } from '../pages/pageEditor'
import { useGameData } from '../context/GameDataContext'
import { useSelection } from '../context/SelectionContext'
import styles from './app.module.css'

export const App: React.FC = (): React.JSX.Element => {
  const { game, setGame, status, saveGame } = useGameData()
  const { selected } = useSelection()

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

  const handlePageCreate = (id: string, fileName: string): void => {
    if (!game) return
    setGame({
      ...game,
      pages: {
        ...(game.pages ?? {}),
        [id]: fileName,
      },
    })
  }

  return (
    <div className={styles.app}>
      <div className={styles.main}>
        <div className={styles.sidebar}>
          <GameTree game={game} />
        </div>
        <div className={styles.content}>
          <div className={styles.header}>
            <span>Status: {status}</span>
            <button onClick={saveGame}>Save</button>
          </div>
          {selected === 'root' && game ? <GameEditor game={game} /> : null}
          {selected === 'pages' ? (
            <CreatePageForm onCreate={handlePageCreate} />
          ) : null}
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

