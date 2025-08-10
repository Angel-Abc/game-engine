import { createContext, useContext, type ReactNode } from 'react'
import type { IStateManager } from '@engine/core/stateManager'
import type { ContextData } from '@engine/core/context'

const StateManagerContext = createContext<IStateManager<ContextData> | null>(null)

export const StateManagerProvider: React.FC<{ stateManager: IStateManager<ContextData>, children: ReactNode }> = ({ stateManager, children }) => (
  <StateManagerContext.Provider value={stateManager}>{children}</StateManagerContext.Provider>
)

export const useStateManager = (): IStateManager<ContextData> => {
  const stateManager = useContext(StateManagerContext)
  if (stateManager === null) {
    throw new Error('useStateManager must be used within a StateManagerProvider')
  }
  return stateManager
}

export default StateManagerContext
