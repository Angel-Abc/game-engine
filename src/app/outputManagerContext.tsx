import { createContext, useContext, type ReactNode } from 'react'
import type { IOutputManager } from '@engine/output/outputManager'

const OutputManagerContext = createContext<IOutputManager | null>(null)

export const OutputManagerProvider: React.FC<{ outputManager: IOutputManager, children: ReactNode }> = ({ outputManager, children }) => (
  <OutputManagerContext.Provider value={outputManager}>{children}</OutputManagerContext.Provider>
)

export const useOutputManager = (): IOutputManager => {
  const outputManager = useContext(OutputManagerContext)
  if (outputManager === null) {
    throw new Error('useOutputManager must be used within an OutputManagerProvider')
  }
  return outputManager
}

export default OutputManagerContext
