import { useEffect, useState } from 'react'
import { gameSchema } from '@loader/schema/game'
import type { Game } from '@loader/data/game'
import { saveGame } from '../main'
import { LanguageList } from './LanguageList'
import { PageList } from './PageList'
import { MapList } from './MapList'
import { MapEditor } from './MapEditor'
import { TileList } from './TileList'
import { DialogList } from './DialogList'
import { StylingList } from './StylingList'
import { HandlerList } from './HandlerList'
import { VirtualKeyList } from './VirtualKeyList'
import { VirtualInputList } from './VirtualInputList'
import { useEditableList } from './useEditableList'
import type { GameMap } from '@loader/data/map'
import type { Tile } from '@loader/data/tile'

export const GameEditor: React.FC = () => {
  const [game, setGame] = useState<Game | null>(null)
  const [styling, setStyling] = useState<string[]>([])
  const [statusMessage, setStatusMessage] = useState('')
  const [saving, setSaving] = useState(false)
  const [loadError, setLoadError] = useState('')
  const [tab, setTab] = useState<'game' | 'map'>('game')
  const [editingMap, setEditingMap] = useState<GameMap | null>(null)
  const [editingTiles, setEditingTiles] = useState<Record<string, Tile>>({})
  const [editingMapId, setEditingMapId] = useState<string | null>(null)
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
            dialogs: {},
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
          dialogs: { ...parsed.dialogs },
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
          dialogs: {},
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
  const setLanguageMap = (
    updater: React.SetStateAction<Record<string, string[]>>,
  ) =>
    setGame((g) => {
      if (!g) return g
      const value = typeof updater === 'function' ? updater(g.languages) : updater
      return { ...g, languages: value }
    })

  const setMap = <K extends 'pages' | 'maps' | 'tiles' | 'dialogs'>(key: K) =>
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

  const openMapEditor = async (id: string) => {
    if (!game) return
    const path = game.maps[id]
    try {
      const res = await fetch(path)
      if (!res.ok) throw new Error('failed')
      const mapData: GameMap = await res.json()
      const tiles: Record<string, Tile> = {}
      await Promise.all(
        (mapData.tileSets || []).map(async (setId: string) => {
          const tilePath = game.tiles[setId]
          if (!tilePath) return
          const tRes = await fetch(tilePath)
          if (!tRes.ok) return
          const tJson = await tRes.json()
          if (Array.isArray(tJson.tiles)) {
            tJson.tiles.forEach((t: Tile) => {
              tiles[t.key] = t
            })
          }
        }),
      )
      setEditingMapId(id)
      setEditingMap(mapData)
      setEditingTiles(tiles)
      setTab('map')
    } catch {
      setStatusMessage('Failed to load map')
    }
  }

  const handleMapSave = async (map: GameMap, tiles: Record<string, Tile>) => {
    if (!game || !editingMapId) return
    const json = JSON.stringify({ map, tiles }, null, 2)
    const path = game.maps[editingMapId]
    const message = await saveGame(
      json,
      (_url, options) => fetch(`/api/map/${encodeURIComponent(path)}`, options),
    )
    setStatusMessage(message)
    setTab('game')
  }

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
      dialogs: game.dialogs,
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
      <nav className="editor-tabs">
        <button type="button" onClick={() => setTab('game')}>Game</button>
        <button
          type="button"
          onClick={() => editingMap && setTab('map')}
          disabled={!editingMap}
        >
          Map Editor
        </button>
      </nav>
      {tab === 'game' && (
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
          <VirtualKeyList
            virtualKeys={game.virtualKeys}
            {...virtualKeyActions}
          />
          <VirtualInputList
            virtualInputs={game.virtualInputs}
            {...virtualInputActions}
          />
          <button type="button" onClick={handleSave} disabled={saving}>
            Save
          </button>
        </>
      )}
      {tab === 'map' && editingMap && (
        <MapEditor
          key={editingMapId ?? undefined}
          map={editingMap}
          tiles={editingTiles}
          onSave={handleMapSave}
          onCancel={() => setTab('game')}
        />
      )}
      {loadError && <p>{loadError}</p>}
      {statusMessage && <p>{statusMessage}</p>}
    </section>
  )
}

