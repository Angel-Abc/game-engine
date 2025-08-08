import type { ChangeEvent, FC } from 'react'
import { useEditorContext } from '@editor/context/EditorContext'

type TileData = string

export interface TileDetailsProps {
  id: string
}

export const TileDetails: FC<TileDetailsProps> = ({ id }) => {
  const { game, setGame } = useEditorContext()
  if (!game) {
    return null
  }
  const tileRecord = game.tiles as unknown as Record<string, TileData>
  const tile = tileRecord[id] ?? ''

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setGame({
      ...game,
      tiles: {
        ...game.tiles,
        [id]: value,
      },
    })
  }

  return (
    <form>
      <label>
        Value:
        <input name="value" value={tile} onChange={handleChange} />
      </label>
    </form>
  )
}

export default TileDetails
