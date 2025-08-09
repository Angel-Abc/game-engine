import React, { useState } from 'react'
import { z } from 'zod'
import { inputSchema } from '../../loader/schema/inputs'
import type { Input } from '../../loader/schema/inputs'

const inputsSchema = z.array(inputSchema)

interface InputsEditorProps {
  value: Input[]
  onChange: (value: Input[]) => void
}

export const InputsEditor: React.FC<InputsEditorProps> = ({ value, onChange }) => {
  const [content, setContent] = useState<string>(JSON.stringify(value, null, 2))
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    const text = e.target.value
    setContent(text)
    try {
      const parsed = JSON.parse(text)
      const result = inputsSchema.safeParse(parsed)
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
      Inputs
      <textarea value={content} onChange={handleChange} rows={10} cols={80} />
      {error ? <div style={{ color: 'red' }}>{error}</div> : null}
    </label>
  )
}

