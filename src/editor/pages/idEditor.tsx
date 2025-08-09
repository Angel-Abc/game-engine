import React, { useState } from 'react'

interface PageIdEditorProps {
  value: string
  onChange: (value: string) => void
}

export const PageIdEditor: React.FC<PageIdEditorProps> = ({ value, onChange }) => {
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const id = e.target.value
    onChange(id)
    setError(id ? '' : 'Id is required')
  }

  return (
    <label>
      Id
      <input type="text" value={value} onChange={handleChange} />
      {error ? <div style={{ color: 'red' }}>{error}</div> : null}
    </label>
  )
}

