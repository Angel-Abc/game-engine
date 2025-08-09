import React, { useState } from 'react'

interface PageEditorProps {
  data: unknown
  onApply: (data: unknown) => void
}

export const PageEditor: React.FC<PageEditorProps> = ({ data, onApply }) => {
  const [content, setContent] = useState<string>(JSON.stringify(data, null, 2))

  const handleApply = () => {
    try {
      onApply(JSON.parse(content))
    } catch {
      // Ignore JSON parse errors for now
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
        <button onClick={handleApply}>Apply</button>
        <button>Cancel</button>
      </div>
    </div>
  )
}
