import type { ChangeEvent, FC } from 'react'
import { useEditorContext } from '@editor/context/EditorContext'

type DialogData = string

export interface DialogDetailsProps {
  id: string
}

export const DialogDetails: FC<DialogDetailsProps> = ({ id }) => {
  const { game, setGame } = useEditorContext()
  if (!game) {
    return null
  }
  const dialogRecord = game.dialogs as unknown as Record<string, DialogData>
  const dialog = dialogRecord[id] ?? ''

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setGame({
      ...game,
      dialogs: {
        ...game.dialogs,
        [id]: value,
      },
    })
  }

  return (
    <form>
      <label>
        Dialog:
        <textarea name="text" value={dialog} onChange={handleChange} />
      </label>
    </form>
  )
}

export default DialogDetails
