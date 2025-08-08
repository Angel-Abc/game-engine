import { createRoot } from 'react-dom/client'
import { GameJsonPage } from './components/GameJsonPage'
import GameTree from './components/GameTree'
import { EditorProvider } from './context/EditorContext'

function EditorApp() {
  return (
    <EditorProvider>
      <div
        style={{
          display: 'flex',
          height: '100vh',
        }}
      >
        <aside
          style={{
            width: '250px',
            borderRight: '1px solid #ccc',
            padding: '1rem',
            boxSizing: 'border-box',
          }}
        >
          <GameTree />
        </aside>
        <main
          style={{
            flex: 1,
            padding: '1rem',
            boxSizing: 'border-box',
            overflow: 'auto',
          }}
        >
          <h1>Game JSON Editor</h1>
          <GameJsonPage />
        </main>
      </div>
    </EditorProvider>
  )
}

if (typeof document !== 'undefined') {
  const root = document.getElementById('app')
  if (root) {
    createRoot(root).render(<EditorApp />)
  }
}
