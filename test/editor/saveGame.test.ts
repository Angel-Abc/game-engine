import { describe, it, expect, vi } from 'vitest'
import { saveGame } from '@editor/api/game'
import type { GameData } from '@editor/types'

const validGame: GameData = {
  title: 't',
  description: 'd',
  version: '1',
  'initial-data': { language: 'en', 'start-page': 'start-page' },
  languages: {},
  pages: {
    start: {
      id: 'p',
      fileName: 'pages/p.json',
      inputs: [],
      screen: { type: 'grid', width: 1, height: 1, components: [] },
    },
  },
  maps: {},
  tiles: {},
  dialogs: {},
}

describe('saveGame', () => {
  it('posts serialized game data', async () => {
    const fetcher = vi.fn().mockResolvedValue({ ok: true } as Response)

    await saveGame(validGame, fetcher)

    expect(fetcher).toHaveBeenCalledWith('/api/game', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...validGame,
        pages: { start: 'pages/p.json' },
      }),
    })
  })
})
