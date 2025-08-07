import { createRoot } from 'react-dom/client'
import { GameEditor } from './components/GameEditor'
import './editor.css'

function EditorApp() {
  return (
    <div>
      <h1>Game JSON Editor</h1>
      <GameEditor />
    </div>
  )
}

if (typeof document !== 'undefined') {
  const root = document.getElementById('app')
  if (root) {
    createRoot(root).render(<EditorApp />)
  }
}
