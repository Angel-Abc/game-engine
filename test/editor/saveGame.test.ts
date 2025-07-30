import { describe, it, expect, vi } from 'vitest'
import { saveGame } from '../../src/editor/main'

describe('saveGame', () => {
  it('alerts when json is invalid and does not fetch', async () => {
    const fetchMock = vi.fn()
    const alertMock = vi.fn()
    await saveGame('invalid', fetchMock as any, alertMock)
    expect(alertMock).toHaveBeenCalledWith('Invalid JSON')
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('posts json and alerts on success', async () => {
    const response = { ok: true } as Response
    const fetchMock = vi.fn().mockResolvedValue(response)
    const alertMock = vi.fn()
    await saveGame('{}', fetchMock as any, alertMock)
    expect(fetchMock).toHaveBeenCalledWith('/api/game', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{}',
    })
    expect(alertMock).toHaveBeenCalledWith('Saved')
  })

  it('alerts error text when request fails', async () => {
    const response = { ok: false, text: vi.fn().mockResolvedValue('error') } as unknown as Response
    const fetchMock = vi.fn().mockResolvedValue(response)
    const alertMock = vi.fn()
    await saveGame('{}', fetchMock as any, alertMock)
    expect(alertMock).toHaveBeenCalledWith('error')
  })
})
