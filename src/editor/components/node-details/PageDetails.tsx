import type { ChangeEvent, FC } from 'react'
import { useEditorContext } from '@editor/context/EditorContext'
import type { Page } from '@editor/data/page'
import { isPage } from '@editor/data/page'

export interface PageDetailsProps {
  id: string
}

export const PageDetails: FC<PageDetailsProps> = ({ id }) => {
  const { game, setGame } = useEditorContext()
  if (!game) {
    return null
  }
  const page = isPage(game.pages[id]) ? game.pages[id] : { title: '', description: '' }

  const handleChange = (field: keyof Page) => (
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

export default PageDetails
