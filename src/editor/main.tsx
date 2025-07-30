import { createRoot } from 'react-dom/client'
import { GameEditor } from './components/GameEditor'
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
  let response: Response
  try {
    response = await fetchFn('/api/game', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: json,
    })
  } catch (e) {
    alertFn((e as Error).message)
    return
  }
  if (response.ok) {
    alertFn('Saved')
  } else {
    const error = await response.text()
    alertFn(error)
  }
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
