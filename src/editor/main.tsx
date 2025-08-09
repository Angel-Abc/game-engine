import { createRoot } from 'react-dom/client'
import { App } from './app/app'
import { GameDataProvider } from './context/GameDataContext'
import { SelectionProvider } from './context/SelectionContext'

if (typeof document !== 'undefined') {
  const root = document.getElementById('app')
  if (root) {
    createRoot(root).render(
      <GameDataProvider>
        <SelectionProvider>
          <App />
        </SelectionProvider>
      </GameDataProvider>
    )
  }
}
