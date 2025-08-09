import React from 'react'
import { GameTree } from './gameTree'
import type { Page } from '../types'
import { GameEditor } from './gameEditor'
import { CreatePageForm } from '../pages/createPageForm'
import { PageEditor } from '../pages/pageEditor'
import { useGameData } from '../context/GameDataContext'
import { useSelection } from '../context/SelectionContext'
import { useGameSaver } from './useGameSaver'
import { usePageActions } from './usePageActions'
import { useGameSections } from './useGameSections'
import styles from './app.module.css'

export const App: React.FC = (): React.JSX.Element => {
  const { game, setGame } = useGameData()
  const { selected, setSelected } = useSelection()

  const sections = useGameSections(game)
  const { save, status } = useGameSaver(game)
  const { apply, create, cancel } = usePageActions(
    game,
    setGame,
    selected,
    setSelected,
  )

  return (
    <div className={styles.app}>
      <div className={styles.main}>
        <div className={styles.sidebar}>
          <GameTree game={game} sections={sections} />
        </div>
        <div className={styles.content}>
          <div className={styles.header}>
            <span>Status: {status}</span>
            <button onClick={save}>Save</button>
          </div>
          {selected === 'root' && game ? (
            <GameEditor game={game} onChange={(g) => setGame(g)} />
          ) : null}
          {selected === 'pages' ? <CreatePageForm onCreate={create} /> : null}
          {selected?.startsWith('pages/') && game ? (
            <PageEditor
              key={selected}
              data={game.pages?.[selected.split('/')[1]] as Page}
              onApply={apply}
              onCancel={cancel}
            />
          ) : null}
        </div>
      </div>
    </div>
  )
}
