/* @vitest-environment jsdom */
import { describe, it, expect, beforeAll } from 'vitest'
import { createRoot } from 'react-dom/client'
import { act } from 'react'
import { useMapEditor } from '../../src/editor/components/useMapEditor'

beforeAll(() => {
  ;(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true
})

describe('useMapEditor', () => {
  it('supports brush, fill, undo, and redo', () => {
    const sample = {
      map: {
        key: 'test-map',
        type: 'squares-map' as const,
        width: 2,
        height: 2,
        tileSets: [],
        tiles: [
          { key: 'a', tile: 'grass' },
          { key: 'b', tile: 'water' },
        ],
        map: ['a,a', 'a,a'],
      },
      tiles: {
        grass: { key: 'grass', description: 'Grass', color: '#0f0' },
        water: { key: 'water', description: 'Water', color: '#00f' },
      },
    }

    let hook: ReturnType<typeof useMapEditor> | null = null
    const TestComponent: React.FC = () => {
      hook = useMapEditor()
      return null
    }
    const container = document.createElement('div')
    act(() => {
      createRoot(container).render(<TestComponent />)
    })

    act(() => {
      hook!.loadFromJSON(JSON.stringify(sample))
    })
    act(() => {
      hook!.setSelectedTile('b')
    })
    act(() => {
      hook!.placeTile(0, 0)
    })
    expect(hook!.map!.map[0][0]).toBe('b')

    act(() => {
      hook!.undo()
    })
    expect(hook!.map!.map[0][0]).toBe('a')

    act(() => {
      hook!.redo()
    })
    expect(hook!.map!.map[0][0]).toBe('b')

    act(() => {
      hook!.setTool('fill')
    })
    act(() => {
      hook!.placeTile(1, 1)
    })
    expect(hook!.map!.map.every((row) => row.every((t) => t === 'b'))).toBe(true)

    const json = hook!.saveToJSON()
    const parsed = JSON.parse(json)
    expect(
      parsed.map.map.every((row: string) => row.split(',').every((t: string) => t === 'b')),
    ).toBe(true)
  })
})

