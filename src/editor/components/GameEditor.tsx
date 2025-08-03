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

export const GameEditor: React.FC = () => {
  const [game, setGame] = useState<Game | null>(null)
  const [styling, setStyling] = useState<string[]>([])
  const [statusMessage, setStatusMessage] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/game')
      .then((r) => r.json())
      .then((data) => {
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
      })
      .catch(() => {
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
      })
  }, [])

  const updateLanguageId = (oldId: string, newId: string) => {
    setGame((g) => {
      if (!g) return g
      const languages = { ...g.languages }
      const path = languages[oldId]
      delete languages[oldId]
      languages[newId] = path
      return { ...g, languages }
    })
  }

  const updateLanguagePath = (id: string, path: string) => {
    setGame((g) => {
      if (!g) return g
      return { ...g, languages: { ...g.languages, [id]: path } }
    })
  }

  const addLanguage = () => {
    setGame((g) => {
      if (!g) return g
      const languages = { ...g.languages }
      let newId = 'new-language-1'
      let index = 2
      while (Object.prototype.hasOwnProperty.call(languages, newId)) {
        newId = `new-language-${index}`
        index += 1
      }
      languages[newId] = ''
      return { ...g, languages }
    })
  }

  const removeLanguage = (id: string) => {
    setGame((g) => {
      if (!g) return g
      const languages = { ...g.languages }
      delete languages[id]
      return { ...g, languages }
    })
  }

  const updatePageId = (oldId: string, newId: string) => {
    setGame((g) => {
      if (!g) return g
      const pages = { ...g.pages }
      const path = pages[oldId]
      delete pages[oldId]
      pages[newId] = path
      return { ...g, pages }
    })
  }

  const updatePagePath = (id: string, path: string) => {
    setGame((g) => {
      if (!g) return g
      return { ...g, pages: { ...g.pages, [id]: path } }
    })
  }

  const addPage = () => {
    setGame((g) => {
      if (!g) return g
      const pages = { ...g.pages }
      let newId = 'new-page-1'
      let i = 2
      while (Object.prototype.hasOwnProperty.call(pages, newId)) {
        newId = `new-page-${i}`
        i += 1
      }
      pages[newId] = ''
      return { ...g, pages }
    })
  }

  const removePage = (id: string) => {
    setGame((g) => {
      if (!g) return g
      const pages = { ...g.pages }
      delete pages[id]
      return { ...g, pages }
    })
  }

  const updateMapId = (oldId: string, newId: string) => {
    setGame((g) => {
      if (!g) return g
      const maps = { ...g.maps }
      const path = maps[oldId]
      delete maps[oldId]
      maps[newId] = path
      return { ...g, maps }
    })
  }

  const updateMapPath = (id: string, path: string) => {
    setGame((g) => {
      if (!g) return g
      return { ...g, maps: { ...g.maps, [id]: path } }
    })
  }

  const addMap = () => {
    setGame((g) => {
      if (!g) return g
      const maps = { ...g.maps }
      let newId = 'new-map-1'
      let i = 2
      while (Object.prototype.hasOwnProperty.call(maps, newId)) {
        newId = `new-map-${i}`
        i += 1
      }
      maps[newId] = ''
      return { ...g, maps }
    })
  }

  const removeMap = (id: string) => {
    setGame((g) => {
      if (!g) return g
      const maps = { ...g.maps }
      delete maps[id]
      return { ...g, maps }
    })
  }

  const updateTileId = (oldId: string, newId: string) => {
    setGame((g) => {
      if (!g) return g
      const tiles = { ...g.tiles }
      const path = tiles[oldId]
      delete tiles[oldId]
      tiles[newId] = path
      return { ...g, tiles }
    })
  }

  const updateTilePath = (id: string, path: string) => {
    setGame((g) => {
      if (!g) return g
      return { ...g, tiles: { ...g.tiles, [id]: path } }
    })
  }

  const addTile = () => {
    setGame((g) => {
      if (!g) return g
      const tiles = { ...g.tiles }
      let newId = 'new-tile-1'
      let i = 2
      while (Object.prototype.hasOwnProperty.call(tiles, newId)) {
        newId = `new-tile-${i}`
        i += 1
      }
      tiles[newId] = ''
      return { ...g, tiles }
    })
  }

  const removeTile = (id: string) => {
    setGame((g) => {
      if (!g) return g
      const tiles = { ...g.tiles }
      delete tiles[id]
      return { ...g, tiles }
    })
  }

  const updateStyling = (index: number, value: string) => {
    setStyling((s) => {
      const arr = [...s]
      arr[index] = value
      return arr
    })
  }

  const addStyling = () => {
    setStyling((s) => [...s, ''])
  }

  const removeStyling = (index: number) => {
    setStyling((s) => s.filter((_, i) => i !== index))
  }

  const updateHandler = (index: number, value: string) => {
    setGame((g) => {
      if (!g) return g
      const handlers = [...g.handlers]
      handlers[index] = value
      return { ...g, handlers }
    })
  }

  const addHandler = () => {
    setGame((g) => {
      if (!g) return g
      return { ...g, handlers: [...g.handlers, ''] }
    })
  }

  const removeHandler = (index: number) => {
    setGame((g) => {
      if (!g) return g
      return { ...g, handlers: g.handlers.filter((_, i) => i !== index) }
    })
  }

  const updateVirtualKey = (index: number, value: string) => {
    setGame((g) => {
      if (!g) return g
      const virtualKeys = [...g.virtualKeys]
      virtualKeys[index] = value
      return { ...g, virtualKeys }
    })
  }

  const addVirtualKey = () => {
    setGame((g) => {
      if (!g) return g
      return { ...g, virtualKeys: [...g.virtualKeys, ''] }
    })
  }

  const removeVirtualKey = (index: number) => {
    setGame((g) => {
      if (!g) return g
      return { ...g, virtualKeys: g.virtualKeys.filter((_, i) => i !== index) }
    })
  }

  const updateVirtualInput = (index: number, value: string) => {
    setGame((g) => {
      if (!g) return g
      const virtualInputs = [...g.virtualInputs]
      virtualInputs[index] = value
      return { ...g, virtualInputs }
    })
  }

  const addVirtualInput = () => {
    setGame((g) => {
      if (!g) return g
      return { ...g, virtualInputs: [...g.virtualInputs, ''] }
    })
  }

  const removeVirtualInput = (index: number) => {
    setGame((g) => {
      if (!g) return g
      return { ...g, virtualInputs: g.virtualInputs.filter((_, i) => i !== index) }
    })
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
      <LanguageList
        languages={game.languages}
        updateLanguageId={updateLanguageId}
        updateLanguagePath={updateLanguagePath}
        addLanguage={addLanguage}
        removeLanguage={removeLanguage}
      />
      <PageList
        pages={game.pages}
        updatePageId={updatePageId}
        updatePagePath={updatePagePath}
        addPage={addPage}
        removePage={removePage}
      />
      <MapList
        maps={game.maps}
        updateMapId={updateMapId}
        updateMapPath={updateMapPath}
        addMap={addMap}
        removeMap={removeMap}
      />
      <TileList
        tiles={game.tiles}
        updateTileId={updateTileId}
        updateTilePath={updateTilePath}
        addTile={addTile}
        removeTile={removeTile}
      />
      <StylingList
        styling={styling}
        updateStyling={updateStyling}
        addStyling={addStyling}
        removeStyling={removeStyling}
      />
      <HandlerList
        handlers={game.handlers}
        updateHandler={updateHandler}
        addHandler={addHandler}
        removeHandler={removeHandler}
      />
      <VirtualKeyList
        virtualKeys={game.virtualKeys}
        updateVirtualKey={updateVirtualKey}
        addVirtualKey={addVirtualKey}
        removeVirtualKey={removeVirtualKey}
      />
      <VirtualInputList
        virtualInputs={game.virtualInputs}
        updateVirtualInput={updateVirtualInput}
        addVirtualInput={addVirtualInput}
        removeVirtualInput={removeVirtualInput}
      />
      <button type="button" onClick={handleSave} disabled={saving}>
        Save
      </button>
      {statusMessage && <p>{statusMessage}</p>}
    </section>
  )
}

