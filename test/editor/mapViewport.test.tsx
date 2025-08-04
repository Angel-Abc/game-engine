/* @vitest-environment jsdom */
import { describe, it, expect, beforeAll } from 'vitest'
import { createRoot } from 'react-dom/client'
import { act } from 'react'
import { MapViewport } from '../../src/editor/components/MapViewport'
import type { GameMap } from '../../src/loader/data/map'
import type { Tile } from '../../src/loader/data/tile'

describe('MapViewport', () => {
  beforeAll(() => {
    ;(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true
  })
  it('defaults position to top-left when none is provided', () => {
    const tile: Tile = { key: 't', description: '', color: 'red' }
    const map: GameMap = {
      key: 'm',
      type: 'squares-map',
      width: 2,
      height: 2,
      tileSets: [],
      tiles: {
        a: { key: 'a', tile: 't' },
        b: { key: 'b', tile: 't' },
        c: { key: 'c', tile: 't' },
        d: { key: 'd', tile: 't' },
      },
      map: [
        ['a', 'b'],
        ['c', 'd'],
      ],
    }
    const container = document.createElement('div')
    document.body.appendChild(container)
    act(() => {
      createRoot(container).render(<MapViewport map={map} tiles={{ t: tile }} />)
    })
    const div = container.querySelector('.squares-map') as HTMLDivElement
    expect(div.style.getPropertyValue('--ge-map-position-left')).toBe('0')
    expect(div.style.getPropertyValue('--ge-map-position-top')).toBe('0')
  })
})
