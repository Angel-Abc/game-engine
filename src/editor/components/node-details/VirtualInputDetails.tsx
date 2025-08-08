import type { ChangeEvent, FC } from 'react'
import { useEditorContext } from '@editor/context/EditorContext'

type VirtualInputData = string

export interface VirtualInputDetailsProps {
  id: string
}

export const VirtualInputDetails: FC<VirtualInputDetailsProps> = ({ id }) => {
  const { game, setGame } = useEditorContext()
  if (!game) {
    return null
  }
  const listRecord = game as unknown as Record<string, VirtualInputData[]>
  const list = listRecord.virtualInputs
  const index = list.indexOf(id)
  const item = list[index] ?? ''

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const newList = [...list]
    newList[index] = value
    setGame({
      ...game,
      virtualInputs: newList,
    } as unknown as typeof game)
  }

  return (
    <form>
      <label>
        Value:
        <input name="value" value={item} onChange={handleChange} />
      </label>
    </form>
  )
}

export default VirtualInputDetails
