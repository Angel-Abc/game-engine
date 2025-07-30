import { createRoot } from 'react-dom/client'
import { useState, useEffect } from 'react'
import './editor.css'

export async function saveGame(
  json: string,
  fetchFn: typeof fetch = fetch,
  alertFn: (msg: string) => void = alert,
) {
  try {
    JSON.parse(json)
  } catch {
    alertFn('Invalid JSON')
    return
  }
  const response = await fetchFn('/api/game', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: json,
  })
  if (response.ok) {
    alertFn('Saved')
  } else {
    const error = await response.text()
    alertFn(error)
  }
}

function EditorApp() {
  const [json, setJson] = useState('{}')

  useEffect(() => {
    fetch('/api/game')
      .then((r) => r.json())
      .then((data) => setJson(JSON.stringify(data, null, 2)))
      .catch(() => setJson('{}'))
  }, [])

  const save = () => saveGame(json)
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

if (typeof document !== 'undefined') {
  const root = document.getElementById('app')
  if (root) {
    createRoot(root).render(<EditorApp />)
  }
}
