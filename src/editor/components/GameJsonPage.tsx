import { useState } from 'react'
import { useEditorContext } from '@editor/context/EditorContext'
import { saveGame } from '../services/api'

export const GameJsonPage: React.FC = () => {
  const { game } = useEditorContext()
  const [status, setStatus] = useState('')

  if (!game) {
    return <div>Loading...</div>
  }

  const handleSave = async () => {
    const message = await saveGame(JSON.stringify(game))
    setStatus(message)
  }

  return (
    <div>
      <pre>{JSON.stringify(game, null, 2)}</pre>
      <div>
        <button type="button" onClick={handleSave}>
          Save
        </button>
      </div>
      {status && <p>{status}</p>}
    </div>
  )
}

export default GameJsonPage
