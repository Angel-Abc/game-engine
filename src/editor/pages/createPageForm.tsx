import React, { useState, useEffect } from 'react'

export const CreatePageForm: React.FC = () => {
  const [id, setId] = useState('')
  const [fileName, setFileName] = useState('')
  const [fileNameManuallySet, setFileNameManuallySet] = useState(false)

  useEffect(() => {
    if (!fileNameManuallySet) {
      setFileName(id ? `pages/${id}.json` : '')
    }
  }, [id, fileNameManuallySet])

  const handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFileName(value)
    setFileNameManuallySet(value !== '')
  }

  return (
    <form style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <label>
        Page ID
        <input type="text" value={id} onChange={(e) => setId(e.target.value)} />
      </label>
      <label>
        File Name
        <input type="text" value={fileName} onChange={handleFileNameChange} />
      </label>
    </form>
  )
}

