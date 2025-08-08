import { createRoot } from 'react-dom/client'
import { GameJsonPage } from './components/GameJsonPage'

function EditorApp() {
  return (
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
        {/* Future tree component */}
        <p>Tree</p>
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
  )
}

if (typeof document !== 'undefined') {
  const root = document.getElementById('app')
  if (root) {
    createRoot(root).render(<EditorApp />)
  }
}
