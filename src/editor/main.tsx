import { createRoot } from 'react-dom/client'
import NodeDetails from './components/NodeDetails'
import GameTree from './components/GameTree'
import { EditorProvider } from './context/EditorContext'
import '../style/reset.css'
import '../style/variables.css'
import './editor.css'

function EditorApp() {
  return (
    <EditorProvider>
      <div className="editor-container">
        <aside className="editor-sidebar">
          <GameTree />
        </aside>
        <main className="editor-main">
          <h1>Game JSON Editor</h1>
          <NodeDetails />
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
