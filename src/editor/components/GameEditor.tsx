import { useEffect, useState } from 'react'
import { gameSchema } from '@loader/schema/game'
import type { Game } from '@loader/data/game'
import { saveGame } from '../main'
import { LanguageList } from './LanguageList'
import { PageList } from './PageList'

export const GameEditor: React.FC = () => {
  const [game, setGame] = useState<Game | null>(null)
  const [styling, setStyling] = useState<string[]>([])

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
      let newId = ''
      let index = 1
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
      let newId = ''
      let i = 1
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

  const handleSave = () => {
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
    }
    const json = JSON.stringify(obj, null, 2)
    void saveGame(json)
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
      <button type="button" onClick={handleSave}>
        Save
      </button>
    </section>
  )
}

