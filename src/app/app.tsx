import { useEffect } from 'react'
import { logInfo } from '@utils/logMessage'

export default function App() {
  useEffect(() => {
    logInfo('App mounted')
  }, [])
  return <div>Game engine initialized.</div>
}
