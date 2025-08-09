/** @vitest-environment jsdom */
import { act } from 'react'
import { describe, it, expect, vi } from 'vitest'
import { createRoot } from 'react-dom/client'
import { PageEditor } from '@editor/pages/pageEditor'

;(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

describe('PageEditor', () => {
  it('applies updates with parsed JSON data', async () => {
    const onApply = vi.fn()
    const container = document.createElement('div')

    await act(async () => {
      createRoot(container).render(
        <PageEditor data={{ foo: 'bar' }} onApply={onApply} />,
      )
    })

    const button = container.querySelector('button')
    await act(async () => {
      button?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })

    expect(onApply).toHaveBeenCalledWith({ foo: 'bar' })
  })
})
