import type { ChangeEvent, FC } from 'react'
import { useEditorContext } from '@editor/context/EditorContext'
import type { MapData } from '@editor/data/map'
import { isMapData } from '@editor/data/map'
import MapEditor from '../MapEditor'

export interface MapDetailsProps {
  id: string
}

export const MapDetails: FC<MapDetailsProps> = ({ id }) => {
  const { game, setGame } = useEditorContext()
  if (!game) {
    return null
  }
  const map = isMapData(game.maps[id]) ? game.maps[id] : { width: 0, height: 0 }

  const handleChange = (field: keyof MapData) => (
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
    <div>
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
      <MapEditor id={id} />
    </div>
  )
}

export default MapDetails
