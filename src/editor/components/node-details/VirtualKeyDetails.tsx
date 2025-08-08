import type { ChangeEvent, FC } from 'react'
import { useEditorContext } from '@editor/context/EditorContext'
import type { VirtualKey } from '@editor/data/inputs'
import { isVirtualKey } from '@editor/data/inputs'

export interface VirtualKeyDetailsProps {
  id: string
}

export const VirtualKeyDetails: FC<VirtualKeyDetailsProps> = ({ id }) => {
  const { game, setGame } = useEditorContext()
  if (!game) {
    return null
  }
  const list = game.virtualKeys
  const index = list.indexOf(id)
  const item: VirtualKey = index >= 0 && isVirtualKey(list[index]) ? list[index] : ''

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const newList = [...list]
    if (index >= 0) {
      newList[index] = value
    }
    setGame({
      ...game,
      virtualKeys: newList,
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

export default VirtualKeyDetails
