import { createContext, useContext, type ReactNode } from 'react'
import type { ITranslationService } from '@engine/dialog/translationService'

const TranslationServiceContext = createContext<ITranslationService | null>(null)

export const TranslationServiceProvider: React.FC<{ translationService: ITranslationService, children: ReactNode }> = ({ translationService, children }) => (
  <TranslationServiceContext.Provider value={translationService}>{children}</TranslationServiceContext.Provider>
)

export const useTranslationService = (): ITranslationService => {
  const translationService = useContext(TranslationServiceContext)
  if (translationService === null) {
    throw new Error('useTranslationService must be used within a TranslationServiceProvider')
  }
  return translationService
}

export default TranslationServiceContext
