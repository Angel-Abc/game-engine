import React from 'react'
import type { GameData, GameTreeSection } from '../types'

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

export const useGameSections = (game: GameData | null): GameTreeSection[] =>
  React.useMemo(() => sectionsFromGame(game), [game])

