import type { ChangeEvent, FC } from 'react'
import { useEditorContext } from '@editor/context/EditorContext'
import type { VirtualInput } from '@editor/data/inputs'
import { isVirtualInput } from '@editor/data/inputs'

export interface VirtualInputDetailsProps {
  id: string
}

export const VirtualInputDetails: FC<VirtualInputDetailsProps> = ({ id }) => {
  const { game, setGame } = useEditorContext()
  if (!game) {
    return null
  }
  const list = game.virtualInputs
  const index = list.indexOf(id)
  const item: VirtualInput =
    index >= 0 && isVirtualInput(list[index]) ? list[index] : ''

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const newList = [...list]
    if (index >= 0) {
      newList[index] = value
    }
    setGame({
      ...game,
      virtualInputs: newList,
    })
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
