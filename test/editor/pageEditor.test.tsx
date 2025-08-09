/** @vitest-environment jsdom */
import { act } from 'react'
import { describe, it, expect, vi } from 'vitest'
import { createRoot } from 'react-dom/client'
import { PageEditor } from '@editor/pages/pageEditor'
import type { Page } from '@editor/types'

;(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

describe('PageEditor', () => {
  it('applies updates with parsed JSON data', async () => {
    const onApply = vi.fn()
    const container = document.createElement('div')

    const page: Page = {
      id: 'test',
      fileName: 'pages/test.json',
      inputs: [],
      screen: { type: 'grid', width: 1, height: 1, components: [] },
    }
    await act(async () => {
      createRoot(container).render(
        <PageEditor data={page} onApply={onApply} />, 
      )
    })

    const button = container.querySelector('button')
    await act(async () => {
      button?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })

    expect(onApply).toHaveBeenCalledWith(page)
  })
})
