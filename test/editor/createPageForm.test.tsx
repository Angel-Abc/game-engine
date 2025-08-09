/** @vitest-environment jsdom */
import { act } from 'react'
import { describe, it, expect, vi } from 'vitest'
import { createRoot } from 'react-dom/client'
import { CreatePageForm } from '@editor/pages/createPageForm'

;(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

describe('CreatePageForm', () => {
  it('renders a create button', () => {
    const onCreate = vi.fn()
    const container = document.createElement('div')
    act(() => {
      createRoot(container).render(<CreatePageForm onCreate={onCreate} />)
    })
    const button = container.querySelector('button')
    expect(button).not.toBeNull()
    expect(button?.textContent).toBe('Create')
  })

  it('calls onCreate with page id', async () => {
    const onCreate = vi.fn()
    const container = document.createElement('div')

    await act(async () => {
      createRoot(container).render(
        <CreatePageForm onCreate={onCreate} initialId="test-page" />, 
      )
    })

    const button = container.querySelector('button') as HTMLButtonElement
    await act(async () => {
      button.click()
    })

    expect(onCreate).toHaveBeenCalledWith('test-page')
  })

  it('rejects invalid page ids', async () => {
    const onCreate = vi.fn()
    const container = document.createElement('div')

    await act(async () => {
      createRoot(container).render(
        <CreatePageForm onCreate={onCreate} initialId="bad/id" />, 
      )
    })

    const button = container.querySelector('button') as HTMLButtonElement
    await act(async () => {
      button.click()
    })

    expect(onCreate).not.toHaveBeenCalled()
  })
})
