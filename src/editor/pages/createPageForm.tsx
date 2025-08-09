import React, { useState, useEffect } from 'react'
import styles from './createPageForm.module.css'

interface CreatePageFormProps {
  onCreate: (id: string, fileName: string) => void
  initialId?: string
  initialFileName?: string
}

export const CreatePageForm: React.FC<CreatePageFormProps> = ({
  onCreate,
  initialId = '',
  initialFileName = '',
}) => {
  const [id, setId] = useState(initialId)
  const [fileName, setFileName] = useState(initialFileName)
  const [fileNameManuallySet, setFileNameManuallySet] = useState(
    initialFileName !== '',
  )

  useEffect(() => {
    if (!fileNameManuallySet) {
      setFileName(id ? `pages/${id}.json` : '')
    }
  }, [id, fileNameManuallySet])

  const handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value
    setFileName(value)
    setFileNameManuallySet(value !== '')
  }

  const handleCreate = (): void => {
    if (!id || !fileName) return
    onCreate(id, fileName)
    setId('')
    setFileName('')
    setFileNameManuallySet(false)
  }

  return (
    <form className={styles.form}>
      <label>
        Page ID
        <input type="text" value={id} onChange={(e) => setId(e.target.value)} />
      </label>
      <label>
        File Name
        <input type="text" value={fileName} onChange={handleFileNameChange} />
      </label>
      <button type="button" onClick={handleCreate}>
        Create
      </button>
    </form>
  )
}

