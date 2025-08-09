import React from 'react'
import type { GameData } from '../types'

interface Section {
  name: string
  items: string[]
}

export const GameTree: React.FC<{ game: GameData | null; onSelect: (node: string) => void }> = ({
  game,
  onSelect,
}) => {
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
    <ul>
      <li>
        <span onClick={() => onSelect('root')} style={{ cursor: 'pointer' }}>
          {game.title}
        </span>
        <ul>
          {sections.map((section) => (
            <li key={section.name}>
              <span
                onClick={() => onSelect(section.name)}
                style={{ cursor: 'pointer' }}
              >
                {section.name}
              </span>
              <ul>
                {section.items.map((item) => (
                  <li key={item}>
                    <span
                      onClick={() => onSelect(`${section.name}/${item}`)}
                      style={{ cursor: 'pointer' }}
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

