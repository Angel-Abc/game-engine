import React, { useState } from 'react'
import styles from './createPageForm.module.css'
import { isValidPageId } from '../utils/pagePath'

interface CreatePageFormProps {
  onCreate: (id: string) => void
  initialId?: string
}

export const CreatePageForm: React.FC<CreatePageFormProps> = ({
  onCreate,
  initialId = '',
}) => {
  const [id, setId] = useState(initialId)
  const [error, setError] = useState('')

  const handleCreate = (): void => {
    if (!id) return
    if (!isValidPageId(id)) {
      setError('Page ID may only include letters, numbers, hyphens, or underscores')
      return
    }
    onCreate(id)
    setId('')
    setError('')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value
    setId(value)
    if (error && isValidPageId(value)) setError('')
  }

  return (
    <form className={styles.form}>
      <label>
        Page ID
        <input type="text" value={id} onChange={handleChange} />
      </label>
      {error ? <div className={styles.error}>{error}</div> : null}
      <button type="button" onClick={handleCreate}>
        Create
      </button>
    </form>
  )
}

