import { createContext, useContext, type ReactNode } from 'react'
import type { IInputManager } from '@engine/input/inputManager'

const InputManagerContext = createContext<IInputManager | null>(null)

export const InputManagerProvider: React.FC<{ inputManager: IInputManager, children: ReactNode }> = ({ inputManager, children }) => (
  <InputManagerContext.Provider value={inputManager}>{children}</InputManagerContext.Provider>
)

export const useInputManager = (): IInputManager => {
  const inputManager = useContext(InputManagerContext)
  if (inputManager === null) {
    throw new Error('useInputManager must be used within an InputManagerProvider')
  }
  return inputManager
}

export default InputManagerContext
