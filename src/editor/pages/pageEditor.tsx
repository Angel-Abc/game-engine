import React, { useState } from 'react'

export type Fetcher = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>

interface PageEditorProps {
  data: unknown
}

export const PageEditor: React.FC<PageEditorProps> = ({ data }) => {
  const [content, setContent] = useState<string>(JSON.stringify(data, null, 2))

  return (
    <div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={20}
        cols={80}
      />
      <div>
        <button>Apply</button>
        <button>Cancel</button>
      </div>
    </div>
  )
}
