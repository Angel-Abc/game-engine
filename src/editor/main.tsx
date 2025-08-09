import { createRoot } from 'react-dom/client'
import { App } from './app/app'

if (typeof document !== 'undefined') {
  const root = document.getElementById('app')
  if (root) {
    createRoot(root).render(<App />)
  }
}
