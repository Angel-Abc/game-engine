import React from 'react'

interface GameData {
  title: string
  pages?: Record<string, unknown>
  maps?: Record<string, unknown>
  tiles?: Record<string, unknown>
  dialogs?: Record<string, unknown>
}

interface Section {
  name: string
  items: string[]
}

export const GameTree: React.FC<{ game: GameData | null }> = ({ game }) => {
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
        {game.title}
        <ul>
          {sections.map((section) => (
            <li key={section.name}>
              {section.name}
              <ul>
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </li>
    </ul>
  )
}

