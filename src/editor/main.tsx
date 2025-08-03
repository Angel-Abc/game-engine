import { createRoot } from 'react-dom/client'
import { GameEditor } from './components/GameEditor'
import './editor.css'

export async function saveGame(
  json: string,
  fetchFn: typeof fetch = fetch,
): Promise<string> {
  try {
    JSON.parse(json)
  } catch {
    return 'Invalid JSON'
  }
  let response: Response
  try {
    response = await fetchFn('/api/game', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: json,
    })
  } catch (e) {
    return (e as Error).message
  }
  if (response.ok) {
    return 'Saved'
  }
  const error = await response.text()
  return error
}

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
