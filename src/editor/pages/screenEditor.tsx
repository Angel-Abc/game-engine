import React from 'react'
import { pageSchema } from '../../loader/schema/page'
import type { Screen } from '../../loader/schema/page'
import { JsonEditor } from '../components/JsonEditor'

const screenSchema = pageSchema.shape.screen

interface ScreenEditorProps {
  value: Screen
  onChange: (value: Screen) => void
}

export const ScreenEditor: React.FC<ScreenEditorProps> = ({ value, onChange }) => (
  <JsonEditor value={value} schema={screenSchema} onChange={onChange} label="Screen" />
)

