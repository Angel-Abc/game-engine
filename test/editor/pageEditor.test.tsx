/** @vitest-environment jsdom */
import { act } from 'react'
import { describe, it, expect, vi } from 'vitest'
import { createRoot } from 'react-dom/client'
import { PageEditor, type Fetcher } from '@editor/pages/pageEditor'

;(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

describe('PageEditor', () => {
  it('posts updates to API endpoint', async () => {
    const fetcher: Fetcher = vi.fn().mockResolvedValue({} as Response)
    const container = document.createElement('div')

    await act(async () => {
      createRoot(container).render(
        <PageEditor id="test" data={{ foo: 'bar' }} fetcher={fetcher} />,
      )
    })

    const button = container.querySelector('button')
    await act(async () => {
      button?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })

    expect(fetcher).toHaveBeenCalledWith('/api/pages/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ foo: 'bar' }, null, 2),
    })
  })
})
