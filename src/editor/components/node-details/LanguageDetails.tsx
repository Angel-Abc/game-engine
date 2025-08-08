import type { ChangeEvent, FC } from 'react'
import { useEditorContext } from '@editor/context/EditorContext'
import type { Language } from '@editor/data/language'
import { isLanguage } from '@editor/data/language'

export interface LanguageDetailsProps {
  id: string
}

export const LanguageDetails: FC<LanguageDetailsProps> = ({ id }) => {
  const { game, setGame } = useEditorContext()
  if (!game) {
    return null
  }
  const lines: Language = isLanguage(game.languages[id]) ? game.languages[id] : []

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
        <textarea name="lines" value={lines.join('\n')} onChange={handleChange} />
      </label>
    </form>
  )
}

export default LanguageDetails
