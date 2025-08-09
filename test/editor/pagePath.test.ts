import { describe, it, expect } from 'vitest'
import { pagePath, isValidPageId, generatePageId } from '@editor/utils/pagePath'

describe('pagePath utility', () => {
  it('builds page file path', () => {
    expect(pagePath('intro')).toBe('pages/intro.json')
  })

  it('validates page ids', () => {
    expect(isValidPageId('valid_id-1')).toBe(true)
    expect(isValidPageId('invalid/id')).toBe(false)
  })

  it('generates page ids using timestamp', () => {
    const fakeNow = () => 123456
    expect(generatePageId('test', fakeNow)).toBe('test-123456')
  })
})
