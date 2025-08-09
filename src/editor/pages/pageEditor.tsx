import React, { useState } from 'react'
import { pageSchema } from '../../loader/schema/page'
import type { Page } from '../types'
import { PageIdEditor } from './idEditor'
import { InputsEditor } from './inputsEditor'
import { ScreenEditor } from './screenEditor'

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
  const [id, setId] = useState<string>(data.id)
  const [inputs, setInputs] = useState(data.inputs)
  const [screen, setScreen] = useState(data.screen)
  const [error, setError] = useState('')

  const handleApply = (): void => {
    const result = pageSchema.safeParse({ id, inputs, screen })
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
  }

  const handleCancel = (): void => {
    setId(data.id)
    setInputs(data.inputs)
    setScreen(data.screen)
    setError('')
    onCancel?.()
  }

  return (
    <form>
      <PageIdEditor value={id} onChange={setId} />
      <InputsEditor value={inputs} onChange={setInputs} />
      <ScreenEditor value={screen} onChange={setScreen} />
      {error && (
        <pre role="alert" style={{ color: 'red' }}>
          {error}
        </pre>
      )}
      <div>
        <button type="button" onClick={handleApply}>
          Apply
        </button>
        <button type="button" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </form>
  )
}

