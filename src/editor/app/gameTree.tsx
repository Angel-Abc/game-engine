import React from 'react'
import type { GameData } from '../types'
import { useSelection } from '../context/SelectionContext'
import styles from './gameTree.module.css'

interface Section {
  name: string
  items: string[]
}

export const GameTree: React.FC<{ game: GameData | null }> = ({ game }) => {
  const { setSelected } = useSelection()
  if (!game) {
    return <div>Loading...</div>
  }

  const sections: Section[] = [
    { name: 'pages', items: Object.keys(game.pages || {}) },
    { name: 'maps', items: Object.keys(game.maps || {}) },
    { name: 'tiles', items: Object.keys(game.tiles || {}) },
    { name: 'dialogs', items: Object.keys(game.dialogs || {}) },
  ]

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

