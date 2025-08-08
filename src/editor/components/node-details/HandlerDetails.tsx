import type { ChangeEvent, FC } from 'react'
import { useEditorContext } from '@editor/context/EditorContext'

type HandlerData = string

export interface HandlerDetailsProps {
  id: string
}

export const HandlerDetails: FC<HandlerDetailsProps> = ({ id }) => {
  const { game, setGame } = useEditorContext()
  if (!game) {
    return null
  }
  const listRecord = game as unknown as Record<string, HandlerData[]>
  const list = listRecord.handlers
  const index = list.indexOf(id)
  const item = list[index] ?? ''

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const newList = [...list]
    newList[index] = value
    setGame({
      ...game,
      handlers: newList,
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

export default HandlerDetails
