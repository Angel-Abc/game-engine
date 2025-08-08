import { useEffect, useState } from 'react'
import { fetchGame, saveGame } from '../services/api'

export const GameJsonPage: React.FC = () => {
  const [json, setJson] = useState('')
  const [status, setStatus] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    fetchGame(controller.signal)
      .then((data) => {
        setJson(JSON.stringify(data, null, 2))
      })
      .catch((err: Error) => {
        setStatus(err.message)
      })
    return () => controller.abort()
  }, [])

  const handleSave = async () => {
    const message = await saveGame(json)
    setStatus(message)
  }

  return (
    <div>
      <textarea value={json} onChange={(e) => setJson(e.target.value)} />
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
