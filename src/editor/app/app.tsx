import React from 'react'
import { GameTree } from './gameTree'
import type { GameTreeSection, GameData, Page } from '../types'
import { GameEditor } from './gameEditor'
import { CreatePageForm } from '../pages/createPageForm'
import { PageEditor } from '../pages/pageEditor'
import { useGameData } from '../context/GameDataContext'
import { useSelection } from '../context/SelectionContext'
import { pagePath } from '../utils/pagePath'
import { saveGame } from '../api/game'
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
  const { game, setGame } = useGameData()
  const { selected, setSelected } = useSelection()
  const [status, setStatus] = React.useState('idle')

  const sections = React.useMemo(() => sectionsFromGame(game), [game])

  const handleSave = async (): Promise<void> => {
    if (!game) return
    setStatus('saving')
    try {
      await saveGame(game)
      setStatus('saved')
    } catch {
      setStatus('error')
    }
  }

  const handlePageApply = (page: Page): void => {
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

  const handlePageCreate = (id: string): void => {
    if (!game) return
    const fileName = pagePath(id)
    setGame({
      ...game,
      pages: {
        ...(game.pages ?? {}),
        [id]: {
          id,
          fileName,
          inputs: [],
          screen: { type: 'grid', width: 1, height: 1, components: [] },
        },
      },
    })
  }

  const handlePageCancel = (): void => {
    setSelected('pages')
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
            <button onClick={handleSave}>Save</button>
          </div>
          {selected === 'root' && game ? (
            <GameEditor game={game} onChange={(g) => setGame(g)} />
          ) : null}
          {selected === 'pages' ? (
            <CreatePageForm onCreate={handlePageCreate} />
          ) : null}
          {selected?.startsWith('pages/') && game ? (
            <PageEditor
              data={game.pages?.[selected.split('/')[1]] as Page}
              onApply={handlePageApply}
              onCancel={handlePageCancel}
            />
          ) : null}
        </div>
      </div>
    </div>
  )
}
