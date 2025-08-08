import type { ChangeEvent, FC } from 'react'
import { useEditorContext } from '@editor/context/EditorContext'

export const GameDetails: FC = () => {
  const { game, setGame } = useEditorContext()
  if (!game) {
    return null
  }

  const handleChange = (field: 'title' | 'description') => (
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value
    setGame({
      ...game,
      [field]: value,
    })
  }

  return (
    <form>
      <label>
        Title:
        <input name="title" value={game.title} onChange={handleChange('title')} />
      </label>
      <label>
        Description:
        <input
          name="description"
          value={game.description}
          onChange={handleChange('description')}
        />
      </label>
    </form>
  )
}

export default GameDetails
