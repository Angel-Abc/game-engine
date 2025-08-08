import type { ChangeEvent, FC } from 'react'
import { useEditorContext } from '@editor/context/EditorContext'

interface PageData {
  title?: string
  description?: string
}

interface MapData {
  width?: number
  height?: number
}

export const NodeDetails: FC = () => {
  const { game, selectedPath, setGame } = useEditorContext()

  if (!game || selectedPath.length < 2) {
    return <div>Select a node</div>
  }

  const [category, id] = selectedPath

  if (category === 'pages') {
    const pageRecord = game.pages as unknown as Record<string, PageData>
    const page = pageRecord[id] ?? { title: '', description: '' }

    const handleChange = (field: 'title' | 'description') => (
      e: ChangeEvent<HTMLInputElement>,
    ) => {
      const value = e.target.value
      setGame({
        ...game,
        pages: {
          ...game.pages,
          [id]: { ...page, [field]: value },
        },
      })
    }

    return (
      <form>
        <label>
          Title:
          <input name="title" value={page.title ?? ''} onChange={handleChange('title')} />
        </label>
        <label>
          Description:
          <input
            name="description"
            value={page.description ?? ''}
            onChange={handleChange('description')}
          />
        </label>
      </form>
    )
  }

  if (category === 'maps') {
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

  return <div>Unsupported node type</div>
}

export default NodeDetails

