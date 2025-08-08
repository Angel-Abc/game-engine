import { describe, it, expect, vi } from 'vitest'
import { saveGame } from '../../src/editor/services/api'

const validGame = JSON.stringify({
  title: '',
  description: '',
  version: '',
  'initial-data': { language: '', 'start-page': '' },
  languages: {},
  pages: {},
  maps: {},
  tiles: {},
  dialogs: {},
  styling: [],
  handlers: [],
  'virtual-keys': [],
  'virtual-inputs': [],
})

describe('saveGame', () => {
  it('returns error message when json is invalid and does not fetch', async () => {
    const fetchMock = vi.fn()
    const result = await saveGame('invalid', fetchMock as any)
    expect(result).toBe('Invalid JSON')
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('returns validation error when json fails schema and does not fetch', async () => {
    const fetchMock = vi.fn()
    const result = await saveGame('{}', fetchMock as any)
    expect(result).toMatch('Validation error')
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('posts json and returns success message', async () => {
    const response = { ok: true } as Response
    const fetchMock = vi.fn().mockResolvedValue(response)
    const result = await saveGame(validGame, fetchMock as any)
    expect(fetchMock).toHaveBeenCalledWith('/api/game', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: validGame,
    })
    expect(result).toBe('Saved')
  })

  it('returns error text when request fails', async () => {
    const response = { ok: false, text: vi.fn().mockResolvedValue('error') } as unknown as Response
    const fetchMock = vi.fn().mockResolvedValue(response)
    const result = await saveGame(validGame, fetchMock as any)
    expect(result).toBe('error')
  })

  it('returns error message when fetch rejects', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error('network'))
    const result = await saveGame(validGame, fetchMock as any)
    expect(result).toBe('network')
  })
})
