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

type TileData = string
type DialogData = string
type HandlerData = string
type VirtualKeyData = string
type VirtualInputData = string
type LanguageData = string[]

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

  if (category === 'tiles') {
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

  if (category === 'dialogs') {
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

  if (category === 'handlers' || category === 'virtualKeys' || category === 'virtualInputs') {
    const listRecord = game as unknown as Record<
      string,
      (HandlerData | VirtualKeyData | VirtualInputData)[]
    >
    const list = listRecord[category] as (HandlerData | VirtualKeyData | VirtualInputData)[]
    const index = list.indexOf(id as string)
    const item = list[index] ?? ''

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      const newList = [...list]
      newList[index] = value
      setGame({
        ...game,
        [category]: newList,
      } as unknown as typeof game)
    }

    return (
      <form>
        <label>
          Value:
          <input name="value" value={item} onChange={handleChange} />
        </label>
      </form>
    )
  }

  if (category === 'languages') {
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

  return <div>Unsupported node type</div>
}

export default NodeDetails

