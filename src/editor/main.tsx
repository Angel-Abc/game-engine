import { createRoot } from 'react-dom/client'
import { GameJsonPage } from './components/GameJsonPage'

function EditorApp() {
  return (
    <div>
      <h1>Game JSON Editor</h1>
      <GameJsonPage />
    </div>
  )
}

if (typeof document !== 'undefined') {
  const root = document.getElementById('app')
  if (root) {
    createRoot(root).render(<EditorApp />)
  }
}
