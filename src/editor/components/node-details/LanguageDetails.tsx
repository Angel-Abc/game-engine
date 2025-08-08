import type { ChangeEvent, FC } from 'react'
import { useEditorContext } from '@editor/context/EditorContext'

type LanguageData = string[]

export interface LanguageDetailsProps {
  id: string
}

export const LanguageDetails: FC<LanguageDetailsProps> = ({ id }) => {
  const { game, setGame } = useEditorContext()
  if (!game) {
    return null
  }
  const langRecord = game.languages as unknown as Record<string, LanguageData>
  const lines = langRecord[id] ?? []

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value.split('\n')
    setGame({
      ...game,
      languages: {
        ...game.languages,
        [id]: value,
      },
    })
  }

  return (
    <form>
      <label>
        Lines:
        <textarea
          name="lines"
          value={lines.join('\n')}
          onChange={handleChange}
        />
      </label>
    </form>
  )
}

export default LanguageDetails
