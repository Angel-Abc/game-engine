import type { ChangeEvent, FC } from 'react'
import { useEditorContext } from '@editor/context/EditorContext'
import type { Handler } from '@editor/data/handler'
import { isHandler } from '@editor/data/handler'

export interface HandlerDetailsProps {
  id: string
}

export const HandlerDetails: FC<HandlerDetailsProps> = ({ id }) => {
  const { game, setGame } = useEditorContext()
  if (!game) {
    return null
  }
  const list = game.handlers
  const index = list.indexOf(id)
  const item: Handler = index >= 0 && isHandler(list[index]) ? list[index] : ''

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const newList = [...list]
    if (index >= 0) {
      newList[index] = value
    }
    setGame({
      ...game,
      handlers: newList,
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

export default HandlerDetails
