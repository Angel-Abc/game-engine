import type { ChangeEvent, FC } from 'react'
import { useEditorContext } from '@editor/context/EditorContext'
import type { Tile } from '@editor/data/tile'
import { isTile } from '@editor/data/tile'

export interface TileDetailsProps {
  id: string
}

export const TileDetails: FC<TileDetailsProps> = ({ id }) => {
  const { game, setGame } = useEditorContext()
  if (!game) {
    return null
  }
  const tile: Tile = isTile(game.tiles[id]) ? game.tiles[id] : { value: '' }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setGame({
      ...game,
      tiles: {
        ...game.tiles,
        [id]: { value },
      },
    })
  }

  return (
    <form>
      <label>
        Value:
        <input name="value" value={tile.value} onChange={handleChange} />
      </label>
    </form>
  )
}

export default TileDetails
