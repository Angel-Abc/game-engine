import { createRoot } from 'react-dom/client'
import { useState } from 'react'
import './editor.css'

function EditorApp() {
  const [json, setJson] = useState('{}')
  return (
    <div>
      <h1>Game JSON Editor</h1>
      <textarea
        style={{ width: '100%', height: '80vh' }}
        value={json}
        onChange={(e) => setJson(e.target.value)}
      />
    </div>
  )
}

const root = document.getElementById('app')
if (root) {
  createRoot(root).render(<EditorApp />)
}
