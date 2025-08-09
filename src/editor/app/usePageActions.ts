import React from 'react'
import type { GameData, Page } from '../types'
import { pagePath, generatePageId } from '../utils/pagePath'

export interface PageActions {
  apply: (page: Page) => void
  create: (baseId: string) => void
  cancel: () => void
}

export const usePageActions = (
  game: GameData | null,
  setGame: (game: GameData) => void,
  selected: string | null,
  setSelected: (id: string) => void
): PageActions => {
  const apply = React.useCallback(
    (page: Page): void => {
      if (!game || !selected?.startsWith('pages/')) return
      const pageId = selected.split('/')[1]
      setGame({
        ...game,
        pages: {
          ...(game.pages ?? {}),
          [pageId]: page,
        },
      })
    },
    [game, selected, setGame]
  )

  const create = React.useCallback(
    (baseId: string): void => {
      if (!game) return
      const fileName = pagePath(baseId)
      const id = generatePageId(baseId)
      setGame({
        ...game,
        pages: {
          ...(game.pages ?? {}),
          [baseId]: {
            id,
            fileName,
            inputs: [],
            screen: { type: 'grid', width: 1, height: 1, components: [] },
          },
        },
      })
    },
    [game, setGame]
  )

  const cancel = React.useCallback((): void => {
    setSelected('pages')
  }, [setSelected])

  return { apply, create, cancel }
}

