import type { ChangeEvent, FC } from 'react'
import { useEditorContext } from '@editor/context/EditorContext'
import type { Dialog } from '@editor/data/dialog'
import { isDialog } from '@editor/data/dialog'

export interface DialogDetailsProps {
  id: string
}

export const DialogDetails: FC<DialogDetailsProps> = ({ id }) => {
  const { game, setGame } = useEditorContext()
  if (!game) {
    return null
  }
  const dialog: Dialog = isDialog(game.dialogs[id]) ? game.dialogs[id] : { text: '' }

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setGame({
      ...game,
      dialogs: {
        ...game.dialogs,
        [id]: { text: value },
      },
    })
  }

  return (
    <form>
      <label>
        Dialog:
        <textarea name="text" value={dialog.text} onChange={handleChange} />
      </label>
    </form>
  )
}

export default DialogDetails
