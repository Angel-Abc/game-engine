import { useEffect, useState, type ChangeEvent } from 'react'
import type { ZodType } from 'zod'

interface JsonEditorProps<T> {
  value: T
  schema: ZodType<T>
  onChange: (value: T) => void
  label: string
}

export const JsonEditor = <T,>({ value, schema, onChange, label }: JsonEditorProps<T>) => {
  const [content, setContent] = useState<string>(JSON.stringify(value, null, 2))
  const [error, setError] = useState('')

  useEffect(() => {
    setContent(JSON.stringify(value, null, 2))
  }, [value])

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    const text = e.target.value
    setContent(text)
    try {
      const parsed = JSON.parse(text) as unknown
      const result = schema.safeParse(parsed)
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
      {label}
      <textarea value={content} onChange={handleChange} rows={10} cols={80} />
      {error ? <div style={{ color: 'red' }}>{error}</div> : null}
    </label>
  )
}

