/** @vitest-environment jsdom */
import React, { useEffect, act } from 'react'
import { describe, it, expect, vi } from 'vitest'
import { createRoot } from 'react-dom/client'
import { useGameData, type Fetcher } from '@editor/hooks/useGameData'
import type { GameData } from '@editor/types'

;(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

const TestComponent: React.FC<{ fetcher: Fetcher; onData: (data: GameData | null) => void }> = ({ fetcher, onData }) => {
  const data = useGameData(fetcher)

  useEffect(() => {
    onData(data)
  }, [data, onData])

  return null
}

describe('useGameData', () => {
  it('fetches game data using the provided fetcher', async () => {
    const mockData: GameData = { title: 'Test Game' }
    const fetcher: Fetcher = vi.fn().mockResolvedValue({
      json: () => Promise.resolve(mockData),
    } as unknown as Response)
    const onData = vi.fn()

    const container = document.createElement('div')
    await act(async () => {
      createRoot(container).render(<TestComponent fetcher={fetcher} onData={onData} />)
    })

    await act(async () => {
      await Promise.resolve()
    })

    expect(fetcher).toHaveBeenCalledWith('/api/game')
    expect(onData).toHaveBeenLastCalledWith(mockData)
  })
})

