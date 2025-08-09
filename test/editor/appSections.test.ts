import { describe, it, expect } from 'vitest'
import { sectionsFromGame } from '@editor/app/useGameSections'
import type { GameData } from '@editor/types'

describe('sectionsFromGame', () => {
  it('returns sections for defined keys', () => {
    const game: GameData = {
      title: 'Test',
      pages: {
        start: {
          id: 'start',
          inputs: [],
          screen: { type: 'grid', width: 1, height: 1, components: [] },
        },
      },
      tiles: {},
    }
    const sections = sectionsFromGame(game)
    const names = sections.map((s) => s.name)
    expect(names).toContain('pages')
    expect(names).toContain('tiles')
    expect(names).not.toContain('maps')
  })
})
