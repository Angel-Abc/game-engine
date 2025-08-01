import { useEffect, useState } from 'react'
import { gameSchema } from '@loader/schema/game'
import type { Game } from '@loader/data/game'
import { saveGame } from '../main'

type LanguageEntry = { id: string; path: string }
type PageEntry = { id: string; path: string }

export const GameEditor: React.FC = () => {
  const [game, setGame] = useState<Omit<Game, 'languages' | 'pages'> & { languages: LanguageEntry[]; pages: PageEntry[] } | null>(null)
  const [styling, setStyling] = useState<string[]>([])

  useEffect(() => {
    fetch('/api/game')
      .then((r) => r.json())
      .then((data) => {
        const parsed = gameSchema.parse(data)
        const result = {
          title: parsed.title,
          description: parsed.description,
          version: parsed.version,
          initialData: {
            language: parsed['initial-data'].language,
            startPage: parsed['initial-data']['start-page'],
          },
          languages: Object.entries(parsed.languages).map(([id, path]) => ({ id, path })),
          pages: Object.entries(parsed.pages).map(([id, path]) => ({ id, path })),
          maps: { ...parsed.maps },
          tiles: { ...parsed.tiles },
          handlers: [...parsed.handlers],
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
          languages: [],
          pages: [],
          maps: {},
          tiles: {},
          handlers: [],
        })
        setStyling([])
      })
  }, [])

  const updateLanguageId = (index: number, newId: string) => {
    setGame((g) => {
      if (!g) return g
      const languages = [...g.languages]
      languages[index] = { ...languages[index], id: newId }
      return { ...g, languages }
    })
  }

  const updateLanguagePath = (index: number, path: string) => {
    setGame((g) => {
      if (!g) return g
      const languages = [...g.languages]
      languages[index] = { ...languages[index], path }
      return { ...g, languages }
    })
  }

  const updatePageId = (index: number, newId: string) => {
    setGame((g) => {
      if (!g) return g
      const pages = [...g.pages]
      pages[index] = { ...pages[index], id: newId }
      return { ...g, pages }
    })
  }

  const updatePagePath = (index: number, path: string) => {
    setGame((g) => {
      if (!g) return g
      const pages = [...g.pages]
      pages[index] = { ...pages[index], path }
      return { ...g, pages }
    })
  }

  const addLanguage = () => {
    setGame((g) => (g ? { ...g, languages: [...g.languages, { id: '', path: '' }] } : g))
  }

  const removeLanguage = (index: number) => {
    setGame((g) => (g ? { ...g, languages: g.languages.filter((_, i) => i !== index) } : g))
  }

  const addPage = () => {
    setGame((g) => (g ? { ...g, pages: [...g.pages, { id: '', path: '' }] } : g))
  }

  const removePage = (index: number) => {
    setGame((g) => (g ? { ...g, pages: g.pages.filter((_, i) => i !== index) } : g))
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
      languages: Object.fromEntries(game.languages.map((l) => [l.id, l.path])),
      pages: Object.fromEntries(game.pages.map((p) => [p.id, p.path])),
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
    <div>
      <div>
        <label>
          Title:
          <input
            type="text"
            value={game.title}
            onChange={(e) => setGame({ ...game, title: e.target.value })}
          />
        </label>
      </div>
      <div>
        <label>
          Description:
          <textarea
            value={game.description}
            onChange={(e) => setGame({ ...game, description: e.target.value })}
          />
        </label>
      </div>
      <div>
        <label>
          Version:
          <input
            type="text"
            value={game.version}
            onChange={(e) => setGame({ ...game, version: e.target.value })}
          />
        </label>
      </div>
      <div>
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
      </div>
      <div>
        <h2>Languages</h2>
        {game.languages.map(({ id, path }, i) => (
          <div key={i}>
            <input
              type="text"
              value={id}
              onChange={(e) => updateLanguageId(i, e.target.value)}
            />
            <input
              type="text"
              value={path}
              onChange={(e) => updateLanguagePath(i, e.target.value)}
            />
            <button type="button" onClick={() => removeLanguage(i)}>
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={addLanguage}>
          Add Language
        </button>
      </div>
      <div>
        <h2>Pages</h2>
        {game.pages.map(({ id, path }, i) => (
          <div key={i}>
            <input
              type="text"
              value={id}
              onChange={(e) => updatePageId(i, e.target.value)}
            />
            <input
              type="text"
              value={path}
              onChange={(e) => updatePagePath(i, e.target.value)}
            />
            <button type="button" onClick={() => removePage(i)}>
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={addPage}>
          Add Page
        </button>
      </div>
      <button type="button" onClick={handleSave}>
        Save
      </button>
    </div>
  )
}

