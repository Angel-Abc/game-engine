import { describe, it, expect } from 'vitest'
import { Screen } from '@app/controls/screen'
import type { Component } from '@loader/data/component'
import type { Screen as ScreenData } from '@loader/data/page'

describe('Screen', () => {
  it('applies grid position variables to components', () => {
    const screenData: ScreenData = { type: 'grid', width: 10, height: 10 }
    const components: Component[] = [
      { type: 'game-menu', position: { top: 1, left: 2, right: 3, bottom: 4 }, buttons: [] },
    ]

    const element = Screen({ screen: screenData, components }) as React.ReactElement<Record<string, unknown>>
    const child = (element.props.children as React.ReactElement<Record<string, unknown>>[])[0]
    const style = child.props.style as Record<string, string>

    expect(style['--grid-top']).toBe('2')
    expect(style['--grid-left']).toBe('3')
    expect(style['--grid-right']).toBe('4')
    expect(style['--grid-bottom']).toBe('5')
  })
})
