import { useEffect, useState } from 'react'
import { gameSchema } from '@loader/schema/game'
import type { Game } from '@loader/data/game'
import { saveGame } from '../main'
import { LanguageList } from './LanguageList'
import { PageList } from './PageList'
import { MapList } from './MapList'
import { TileList } from './TileList'
import { StylingList } from './StylingList'
import { HandlerList } from './HandlerList'
import { VirtualKeyList } from './VirtualKeyList'
import { VirtualInputList } from './VirtualInputList'
import { useEditableList } from './useEditableList'

export const GameEditor: React.FC = () => {
  const [game, setGame] = useState<Game | null>(null)
  const [styling, setStyling] = useState<string[]>([])
  const [statusMessage, setStatusMessage] = useState('')
  const [saving, setSaving] = useState(false)
  const [loadError, setLoadError] = useState('')
  useEffect(() => {
    const controller = new AbortController()

    const load = async () => {
      try {
        const response = await fetch('/api/game', {
          signal: controller.signal,
        })

        if (!response.ok) {
          setLoadError('Failed to load game data.')
          setGame({
            title: '',
            description: '',
            version: '',
            initialData: { language: '', startPage: '' },
            languages: {},
            pages: {},
            maps: {},
            tiles: {},
            handlers: [],
            virtualKeys: [],
            virtualInputs: [],
          })
          setStyling([])
          return
        }

        const data = await response.json()
        const parsed = gameSchema.parse(data)
        const result: Game = {
          title: parsed.title,
          description: parsed.description,
          version: parsed.version,
          initialData: {
            language: parsed['initial-data'].language,
            startPage: parsed['initial-data']['start-page'],
          },
          languages: { ...parsed.languages },
          pages: { ...parsed.pages },
          maps: { ...parsed.maps },
          tiles: { ...parsed.tiles },
          handlers: [...parsed.handlers],
          virtualKeys: [...parsed['virtual-keys']],
          virtualInputs: [...parsed['virtual-inputs']],
        }
        setGame(result)
        setStyling(parsed.styling)
      } catch (err) {
        if ((err as Error).name === 'AbortError') return
        setLoadError('Failed to load game data.')
        setGame({
          title: '',
          description: '',
          version: '',
          initialData: { language: '', startPage: '' },
          languages: {},
          pages: {},
          maps: {},
          tiles: {},
          handlers: [],
          virtualKeys: [],
          virtualInputs: [],
        })
        setStyling([])
      }
    }

    load()
    return () => controller.abort()
  }, [])
  const setMap = <K extends 'languages' | 'pages' | 'maps' | 'tiles'>(key: K) =>
    (updater: React.SetStateAction<Record<string, string>>) =>
      setGame((g) => {
        if (!g) return g
        const value =
          typeof updater === 'function' ? updater(g[key]) : updater
        return { ...g, [key]: value }
      })

  const setArray = <
    K extends 'handlers' | 'virtualKeys' | 'virtualInputs'
  >(key: K) => (updater: React.SetStateAction<string[]>) =>
    setGame((g) => {
      if (!g) return g
      const value =
        typeof updater === 'function' ? updater(g[key]) : updater
      return { ...g, [key]: value }
    })

  const languageActions = useEditableList(setMap('languages'), {
    type: 'map',
    prefix: 'language',
  })
  const pageActions = useEditableList(setMap('pages'), {
    type: 'map',
    prefix: 'page',
  })
  const mapActions = useEditableList(setMap('maps'), {
    type: 'map',
    prefix: 'map',
  })
  const tileActions = useEditableList(setMap('tiles'), {
    type: 'map',
    prefix: 'tile',
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

  const handleSave = async () => {
    if (!game) return
    const obj = {
      title: game.title,
      description: game.description,
      version: game.version,
      'initial-data': {
        language: game.initialData.language,
        'start-page': game.initialData.startPage,
      },
      languages: game.languages,
      pages: game.pages,
      maps: game.maps,
      tiles: game.tiles,
      styling,
      handlers: game.handlers,
      'virtual-keys': game.virtualKeys,
      'virtual-inputs': game.virtualInputs,
    }
    const json = JSON.stringify(obj, null, 2)
    setSaving(true)
    const message = await saveGame(json)
    setStatusMessage(message)
    setSaving(false)
  }

  if (!game) return <div>Loading...</div>

  return (
    <section className="editor">
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
      <MapList maps={game.maps} {...mapActions} />
      <TileList tiles={game.tiles} {...tileActions} />
      <StylingList styling={styling} {...stylingActions} />
      <HandlerList handlers={game.handlers} {...handlerActions} />
      <VirtualKeyList virtualKeys={game.virtualKeys} {...virtualKeyActions} />
      <VirtualInputList
        virtualInputs={game.virtualInputs}
        {...virtualInputActions}
      />
      <button type="button" onClick={handleSave} disabled={saving}>
        Save
      </button>
      {loadError && <p>{loadError}</p>}
      {statusMessage && <p>{statusMessage}</p>}
    </section>
  )
}

