import { describe, it, expect } from 'vitest'
import { resolveTileSet } from '../../src/editor/resolveTileSet'
import type { Tile } from '../../src/loader/data/tile'

describe('resolveTileSet', () => {
  it('prefixes tile images with /data', () => {
    const tiles: Tile[] = [
      { key: 'outdoor.ocean', description: '', color: 'aqua', image: 'outdoor/waves.svg' },
    ]
    const result = resolveTileSet('tiles/outdoor.json', tiles)
    expect(result['outdoor.ocean'].image).toBe('/data/tiles/outdoor/waves.svg')
  })

  it('handles tiles without images', () => {
    const tiles: Tile[] = [
      { key: 'outdoor.beach', description: '', color: 'yellow' },
    ]
    const result = resolveTileSet('tiles/outdoor.json', tiles)
    expect(result['outdoor.beach'].image).toBeUndefined()
  })
})
