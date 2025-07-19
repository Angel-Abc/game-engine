import { describe, it, expect, afterEach, vi } from 'vitest'
import { GameEngine } from '@engine/gameEngine'
import type { GameData } from '@data/game/game'

vi.mock('@utility/logMessage', async () => {
  const actual = await vi.importActual<typeof import('@utility/logMessage')>('@utility/logMessage')
  return {
    ...actual,
    logInfo: vi.fn(),
    logDebug: vi.fn(),
    logWarning: vi.fn(),
  }
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('GameEngine', () => {
  it('throws when updating to an unknown page', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const game: GameData = {
      title: 't',
      description: '',
      version: '1',
      startPage: 'start',
      modules: {
        start: {
          type: 'page',
          description: '',
          screen: { type: 'grid', rows: 1, columns: 1 },
          components: [],
        },
      },
      translations: { languages: {} },
      virtualKeys: {},
      virtualInputs: {},
      css: [],
      tiles: {},
      maps: {},
    }

    const engine = new GameEngine(game)
    expect(() => engine.updatePage('missing')).toThrowError('Page module missing not found')
    engine.cleanup()
    errorSpy.mockRestore()
  })
})
