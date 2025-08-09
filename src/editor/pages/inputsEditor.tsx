import React from 'react'
import { z } from 'zod'
import { inputSchema } from '../../loader/schema/inputs'
import type { Input } from '../../loader/schema/inputs'
import { JsonEditor } from '../components/JsonEditor'

const inputsSchema = z.array(inputSchema)

interface InputsEditorProps {
  value: Input[]
  onChange: (value: Input[]) => void
}

export const InputsEditor: React.FC<InputsEditorProps> = ({ value, onChange }) => (
  <JsonEditor value={value} schema={inputsSchema} onChange={onChange} label="Inputs" />
)

