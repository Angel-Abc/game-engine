/** @vitest-environment jsdom */
import React, { useEffect, act } from 'react'
import { describe, it, expect, vi } from 'vitest'
import { createRoot } from 'react-dom/client'
import { GameDataProvider, useGameData } from '@editor/context/GameDataContext'
import type { Fetcher } from '@editor/api/game'
import type { GameData } from '@editor/types'

;(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

const TestComponent: React.FC<{ fetcher: Fetcher; onData: (data: GameData | null) => void }> = ({
  fetcher,
  onData,
}) => (
  <GameDataProvider fetcher={fetcher}>
    <Inner onData={onData} />
  </GameDataProvider>
)

const Inner: React.FC<{ onData: (data: GameData | null) => void }> = ({ onData }) => {
  const { game } = useGameData()
  useEffect(() => {
    onData(game)
  }, [game, onData])
  return null
}

describe('GameDataProvider', () => {
  it('loads game data and provides it through context', async () => {
    const mockData: GameData = { title: 'Test Game' }
    const fetcher: Fetcher = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData),
    } as unknown as Response)
    const onData = vi.fn()

    const container = document.createElement('div')
    await act(async () => {
      createRoot(container).render(<TestComponent fetcher={fetcher} onData={onData} />)
    })

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    expect(fetcher).toHaveBeenCalledWith('/api/game')
    expect(onData).toHaveBeenLastCalledWith(mockData)
  })
})

