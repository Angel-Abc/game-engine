import type { ChangeEvent, FC } from 'react'
import { useEditorContext } from '@editor/context/EditorContext'

type VirtualKeyData = string

export interface VirtualKeyDetailsProps {
  id: string
}

export const VirtualKeyDetails: FC<VirtualKeyDetailsProps> = ({ id }) => {
  const { game, setGame } = useEditorContext()
  if (!game) {
    return null
  }
  const listRecord = game as unknown as Record<string, VirtualKeyData[]>
  const list = listRecord.virtualKeys
  const index = list.indexOf(id)
  const item = list[index] ?? ''

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const newList = [...list]
    newList[index] = value
    setGame({
      ...game,
      virtualKeys: newList,
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

export default VirtualKeyDetails
