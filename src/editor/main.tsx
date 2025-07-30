import { createRoot } from 'react-dom/client'
import { useState, useEffect } from 'react'
import './editor.css'

function EditorApp() {
  const [json, setJson] = useState('{}')

  useEffect(() => {
    fetch('/api/game')
      .then((r) => r.json())
      .then((data) => setJson(JSON.stringify(data, null, 2)))
      .catch(() => setJson('{}'))
  }, [])

  const save = async () => {
    await fetch('/api/game', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: json,
    })
    alert('Saved')
  }
  return (
    <div>
      <h1>Game JSON Editor</h1>
      <textarea
        style={{ width: '100%', height: '80vh' }}
        value={json}
        onChange={(e) => setJson(e.target.value)}
      />
      <button onClick={save}>Save</button>
    </div>
  )
}

const root = document.getElementById('app')
if (root) {
  createRoot(root).render(<EditorApp />)
}
