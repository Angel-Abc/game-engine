import React from 'react'
import type { GameData, GameTreeSection } from '../types'
import { useSelection } from '../context/SelectionContext'
import styles from './gameTree.module.css'

export const GameTree: React.FC<{ game: GameData | null; sections: GameTreeSection[] }> = ({
  game,
  sections,
}) => {
  const { setSelected } = useSelection()
  if (!game) {
    return <div>Loading...</div>
  }

  return (
    <ul className={styles.tree}>
      <li>
        <span onClick={() => setSelected('root')} className={styles.node}>
          {game.title}
        </span>
        <ul>
          {sections.map((section) => (
            <li key={section.name}>
              <span
                onClick={() => setSelected(section.name)}
                className={styles.node}
              >
                {section.name}
              </span>
              <ul>
                {section.items.map((item) => (
                  <li key={item}>
                    <span
                      onClick={() => setSelected(`${section.name}/${item}`)}
                      className={styles.node}
                    >
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </li>
    </ul>
  )
}

