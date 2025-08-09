/** @vitest-environment jsdom */
import { act } from 'react'
import { describe, it, expect } from 'vitest'
import { createRoot } from 'react-dom/client'
import { CreatePageForm } from '@editor/pages/createPageForm'

;(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

describe('CreatePageForm', () => {
  it('renders a create button', () => {
    const container = document.createElement('div')
    act(() => {
      createRoot(container).render(<CreatePageForm />)
    })
    const button = container.querySelector('button')
    expect(button).not.toBeNull()
    expect(button?.textContent).toBe('Create')
  })
})
