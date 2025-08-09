import React, { useState } from 'react'
import { pageSchema } from '../../loader/schema/page'
import type { Screen } from '../../loader/schema/page'

const screenSchema = pageSchema.shape.screen

interface ScreenEditorProps {
  value: Screen
  onChange: (value: Screen) => void
}

export const ScreenEditor: React.FC<ScreenEditorProps> = ({ value, onChange }) => {
  const [content, setContent] = useState<string>(JSON.stringify(value, null, 2))
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    const text = e.target.value
    setContent(text)
    try {
      const parsed = JSON.parse(text)
      const result = screenSchema.safeParse(parsed)
      if (result.success) {
        onChange(result.data)
        setError('')
      } else {
        setError(result.error.issues.map((i) => i.message).join('; '))
      }
    } catch (err) {
      setError((err as Error).message)
    }
  }

  return (
    <label>
      Screen
      <textarea value={content} onChange={handleChange} rows={10} cols={80} />
      {error ? <div style={{ color: 'red' }}>{error}</div> : null}
    </label>
  )
}

