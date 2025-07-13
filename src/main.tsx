import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { logDebug } from '@utility/logMessage.ts'
import { loadJsonResource } from '@utility/loadJsonResource.ts'
import { gameSchema, type Game } from '@data/game/game'
import App from './app/game.tsx'

logDebug('Application starting...')

const game: Game = await loadJsonResource<Game>('/data/game.json', gameSchema)
logDebug('Game loaded: {0}', game)

const root = createRoot(document.body)
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
)

