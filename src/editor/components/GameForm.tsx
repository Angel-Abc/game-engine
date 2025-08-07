import type React from 'react'
import type { Game } from '@loader/data/game'
import { LanguageList } from './LanguageList'
import { PageList } from './PageList'
import { MapList } from './MapList'
import { TileList } from './TileList'
import { DialogList } from './DialogList'
import { StylingList } from './StylingList'
import { HandlerList } from './HandlerList'
import { VirtualKeyList } from './VirtualKeyList'
import { VirtualInputList } from './VirtualInputList'
import { useEditableList } from './useEditableList'

interface GameFormProps {
  game: Game
  setGame: React.Dispatch<React.SetStateAction<Game>>
  styling: string[]
  setStyling: React.Dispatch<React.SetStateAction<string[]>>
  openMapEditor: (id: string) => void
  onSave: () => void
  saving: boolean
}

export const GameForm: React.FC<GameFormProps> = ({
  game,
  setGame,
  styling,
  setStyling,
  openMapEditor,
  onSave,
  saving,
}) => {
  const setLanguageMap = (
    updater: React.SetStateAction<Record<string, string[]>>,
  ) =>
    setGame((g) => ({ ...g, languages: typeof updater === 'function' ? updater(g.languages) : updater }))

  const setMap = <K extends 'pages' | 'maps' | 'tiles' | 'dialogs'>(key: K) =>
    (updater: React.SetStateAction<Record<string, string>>) =>
      setGame((g) => ({ ...g, [key]: typeof updater === 'function' ? updater(g[key]) : updater }))

  const setArray = <K extends 'handlers' | 'virtualKeys' | 'virtualInputs'>(key: K) =>
    (updater: React.SetStateAction<string[]>) =>
      setGame((g) => ({ ...g, [key]: typeof updater === 'function' ? updater(g[key]) : updater }))

  const languageActions = useEditableList<string[]>(setLanguageMap, {
    type: 'map',
    prefix: 'language',
    empty: [],
  })
  const pageActions = useEditableList(setMap('pages'), {
    type: 'map',
    prefix: 'page',
    empty: '',
  })
  const mapActions = useEditableList(setMap('maps'), {
    type: 'map',
    prefix: 'map',
    empty: '',
  })
  const tileActions = useEditableList(setMap('tiles'), {
    type: 'map',
    prefix: 'tile',
    empty: '',
  })
  const dialogActions = useEditableList(setMap('dialogs'), {
    type: 'map',
    prefix: 'dialog',
    empty: '',
  })
  const stylingActions = useEditableList(setStyling, { type: 'array' })
  const handlerActions = useEditableList(setArray('handlers'), {
    type: 'array',
  })
  const virtualKeyActions = useEditableList(setArray('virtualKeys'), {
    type: 'array',
  })
  const virtualInputActions = useEditableList(setArray('virtualInputs'), {
    type: 'array',
  })

  return (
    <>
      <fieldset className="editor-section">
        <label>
          Title:
          <input
            type="text"
            value={game.title}
            onChange={(e) => setGame({ ...game, title: e.target.value })}
          />
        </label>
        <label>
          Description:
          <textarea
            value={game.description}
            onChange={(e) => setGame({ ...game, description: e.target.value })}
          />
        </label>
        <label>
          Version:
          <input
            type="text"
            value={game.version}
            onChange={(e) => setGame({ ...game, version: e.target.value })}
          />
        </label>
      </fieldset>
      <fieldset className="editor-section">
        <label>
          Initial Language:
          <input
            type="text"
            value={game.initialData.language}
            onChange={(e) =>
              setGame({
                ...game,
                initialData: { ...game.initialData, language: e.target.value },
              })
            }
          />
        </label>
        <label>
          Start Page:
          <input
            type="text"
            value={game.initialData.startPage}
            onChange={(e) =>
              setGame({
                ...game,
                initialData: { ...game.initialData, startPage: e.target.value },
              })
            }
          />
        </label>
      </fieldset>
      <LanguageList languages={game.languages} {...languageActions} />
      <PageList pages={game.pages} {...pageActions} />
      <MapList maps={game.maps} onEdit={openMapEditor} {...mapActions} />
      <TileList tiles={game.tiles} {...tileActions} />
      <DialogList dialogs={game.dialogs} {...dialogActions} />
      <StylingList styling={styling} {...stylingActions} />
      <HandlerList handlers={game.handlers} {...handlerActions} />
      <VirtualKeyList virtualKeys={game.virtualKeys} {...virtualKeyActions} />
      <VirtualInputList
        virtualInputs={game.virtualInputs}
        {...virtualInputActions}
      />
      <button type="button" onClick={onSave} disabled={saving}>
        Save
      </button>
    </>
  )
}
