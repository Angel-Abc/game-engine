/* @vitest-environment jsdom */
import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent, screen, within } from '@testing-library/react'
import { GameEditor } from '../../src/editor/components/GameEditor'

// Helper to wait for component to finish initial fetch
async function setup() {
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('fail')))
  render(<GameEditor />)
  await screen.findAllByText('Languages')
  return {
    languagesSection: screen.getAllByRole('heading', { name: 'Languages' })[0].parentElement!,
    pagesSection: screen.getAllByRole('heading', { name: 'Pages' })[0].parentElement!,
  }
}

describe('GameEditor add/remove', () => {
  it('adds blank language and page entries', async () => {
    const { languagesSection, pagesSection } = await setup()

    expect(within(languagesSection).queryAllByText('Remove').length).toBe(0)
    fireEvent.click(within(languagesSection).getByText('Add Language'))
    expect(within(languagesSection).queryAllByText('Remove').length).toBeGreaterThanOrEqual(1)

    expect(within(pagesSection).queryAllByText('Remove').length).toBe(0)
    fireEvent.click(within(pagesSection).getByText('Add Page'))
    expect(within(pagesSection).queryAllByText('Remove').length).toBeGreaterThanOrEqual(1)
  })

  it('removes language and page entries', async () => {
    const { languagesSection, pagesSection } = await setup()

    fireEvent.click(within(languagesSection).getByText('Add Language'))
    fireEvent.click(within(pagesSection).getByText('Add Page'))
    expect(within(languagesSection).queryAllByText('Remove').length).toBeGreaterThanOrEqual(1)
    expect(within(pagesSection).queryAllByText('Remove').length).toBeGreaterThanOrEqual(1)

    const langBefore = within(languagesSection).queryAllByText('Remove').length
    fireEvent.click(within(languagesSection).getAllByText('Remove')[0])
    expect(within(languagesSection).queryAllByText('Remove').length).toBeLessThan(langBefore)

    const pageBefore = within(pagesSection).queryAllByText('Remove').length
    fireEvent.click(within(pagesSection).getAllByText('Remove')[0])
    expect(within(pagesSection).queryAllByText('Remove').length).toBeLessThan(pageBefore)
  })
})
