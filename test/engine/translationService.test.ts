import { describe, it, expect } from 'vitest'
import { TranslationService } from '@engine/dialog/translationService'
import type { Language } from '@loader/data/language'


describe('TranslationService', () => {
  it('translates known keys', () => {
    const service = new TranslationService()
    const lang: Language = { id: 'en', translations: { KEY: 'value' } }
    service.setLanguage(lang)
    expect(service.translate('KEY')).toBe('value')
  })

  it('returns key when translation is missing', () => {
    const service = new TranslationService()
    const lang: Language = { id: 'en', translations: {} }
    service.setLanguage(lang)
    expect(service.translate('MISSING')).toBe('MISSING')
  })

  it('throws when language is not set', () => {
    const service = new TranslationService()
    expect(() => service.translate('KEY')).toThrowError('No language was set!')
  })
})
