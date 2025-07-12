import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { logDebug } from '@utility/logMessage.ts'
import { loadJsonResource } from '@utility/loadJsonResource.ts'
import { gameSchema, type Game } from '@data/game'

logDebug('Application starting...')

const game: Game = await loadJsonResource<Game>('/data/game.json', gameSchema)
logDebug('Game loaded: {0}', game)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
