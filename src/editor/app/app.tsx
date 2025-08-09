import React from 'react'
import { GameTree } from './gameTree'
import type { GameTreeSection, GameData } from '../types'
import { GameEditor } from './gameEditor'
import { CreatePageForm } from '../pages/createPageForm'
import { PageEditor } from '../pages/pageEditor'
import { useGameData } from '../context/GameDataContext'
import { useSelection } from '../context/SelectionContext'
import styles from './app.module.css'

export const sectionsFromGame = (game: GameData | null): GameTreeSection[] => {
  if (!game) return []
  const sections: GameTreeSection[] = []
  if (game.pages) sections.push({ name: 'pages', items: Object.keys(game.pages) })
  if (game.maps) sections.push({ name: 'maps', items: Object.keys(game.maps) })
  if (game.tiles) sections.push({ name: 'tiles', items: Object.keys(game.tiles) })
  if (game.dialogs)
    sections.push({ name: 'dialogs', items: Object.keys(game.dialogs) })
  return sections
}

export const App: React.FC = (): React.JSX.Element => {
  const { game, setGame, status, saveGame } = useGameData()
  const { selected } = useSelection()

  const sections = React.useMemo(() => sectionsFromGame(game), [game])

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
          <GameTree game={game} sections={sections} />
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

