import { createContext, useContext, type ReactNode } from 'react'
import type { IGameEngine } from '@engine/core/gameEngine'

const GameEngineContext = createContext<IGameEngine | null>(null)

export const GameEngineProvider: React.FC<{ engine: IGameEngine, children: ReactNode }> = ({ engine, children }) => (
  <GameEngineContext.Provider value={engine}>{children}</GameEngineContext.Provider>
)

export const useGameEngine = (): IGameEngine => {
  const engine = useContext(GameEngineContext)
  if (engine === null) {
    throw new Error('useGameEngine must be used within a GameEngineProvider')
  }
  return engine
}

export default GameEngineContext
