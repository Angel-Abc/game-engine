import type { ChangeEvent, FC } from 'react'
import { useEditorContext } from '@editor/context/EditorContext'

interface MapData {
  width?: number
  height?: number
}

export interface MapDetailsProps {
  id: string
}

export const MapDetails: FC<MapDetailsProps> = ({ id }) => {
  const { game, setGame } = useEditorContext()
  if (!game) {
    return null
  }
  const mapRecord = game.maps as unknown as Record<string, MapData>
  const map = mapRecord[id] ?? { width: 0, height: 0 }

  const handleChange = (field: 'width' | 'height') => (
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    const value = parseInt(e.target.value, 10) || 0
    setGame({
      ...game,
      maps: {
        ...game.maps,
        [id]: { ...map, [field]: value },
      },
    })
  }

  return (
    <form>
      <label>
        Width:
        <input
          name="width"
          type="number"
          value={map.width ?? 0}
          onChange={handleChange('width')}
        />
      </label>
      <label>
        Height:
        <input
          name="height"
          type="number"
          value={map.height ?? 0}
          onChange={handleChange('height')}
        />
      </label>
    </form>
  )
}

export default MapDetails
