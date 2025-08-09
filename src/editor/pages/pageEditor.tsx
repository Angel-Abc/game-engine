import React, { useState } from 'react'
import { pageSchema } from '../../loader/schema/page'
import type { Page } from '../types'

interface PageEditorProps {
  data: Page
  onApply: (data: Page) => void
  onCancel?: () => void
}

export const PageEditor: React.FC<PageEditorProps> = ({
  data,
  onApply,
  onCancel,
}) => {
  const initialContent = JSON.stringify(
    { id: data.id, inputs: data.inputs, screen: data.screen },
    null,
    2,
  )
  const [content, setContent] = useState<string>(initialContent)
  const [error, setError] = useState<string>('')

  const handleApply = (): void => {
    try {
      const parsed = JSON.parse(content)
      const result = pageSchema.safeParse(parsed)
      if (!result.success) {
        setError(result.error.issues.map((i) => i.message).join('; '))
        return
      }
      setError('')
      const updated =
        data.fileName !== undefined
          ? { ...result.data, fileName: data.fileName }
          : result.data
      onApply(updated)
    } catch (e) {
      setError((e as Error).message)
    }
  }

  const handleCancel = (): void => {
    setContent(initialContent)
    setError('')
    onCancel?.()
  }

  return (
    <div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={20}
        cols={80}
      />
      {error && (
        <pre role="alert" style={{ color: 'red' }}>
          {error}
        </pre>
      )}
      <div>
        <button onClick={handleApply}>Apply</button>
        <button onClick={handleCancel}>Cancel</button>
      </div>
    </div>
  )
}
