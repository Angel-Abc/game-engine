import React, { useState } from 'react'

export type Fetcher = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>

interface PageEditorProps {
  id: string
  data: unknown
  fetcher?: Fetcher
}

export const PageEditor: React.FC<PageEditorProps> = ({ id, data, fetcher = fetch }) => {
  const [content, setContent] = useState<string>(JSON.stringify(data, null, 2))
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  const handleSave = async (): Promise<void> => {
    setStatus('saving')
    try {
      await fetcher(`/api/pages/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: content,
      })
      setStatus('saved')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={20}
        cols={80}
      />
      <div>
        <button onClick={handleSave}>Save</button>
        <span>Status: {status}</span>
      </div>
    </div>
  )
}
