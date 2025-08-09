import { describe, it, expect, vi } from 'vitest'
import type { Screen as ScreenData } from '@loader/data/page'
import type { IGameEngine } from '@engine/core/gameEngine'

const engine = { resolveCondition: () => true } as unknown as IGameEngine
vi.mock('@app/engineContext', () => ({ useGameEngine: () => engine }))
import { Screen } from '@app/controls/screen'

describe('Screen', () => {
  it('applies grid position variables to components', () => {
    const screenData: ScreenData = {
      type: 'grid',
      width: 10,
      height: 10,
      components: [
        {
          position: { top: 1, left: 2, right: 3, bottom: 4 },
          component: { type: 'game-menu', buttons: [] },
        },
      ],
    }

    const element = Screen({ screen: screenData }) as React.ReactElement<Record<string, unknown>>
    const child = (element.props.children as React.ReactElement<Record<string, unknown>>[])[0]
    const style = child.props.style as Record<string, string>

    expect(style['--ge-grid-item-top']).toBe('2')
    expect(style['--ge-grid-item-left']).toBe('3')
    expect(style['--ge-grid-item-right']).toBe('4')
    expect(style['--ge-grid-item-bottom']).toBe('5')
  })
})
