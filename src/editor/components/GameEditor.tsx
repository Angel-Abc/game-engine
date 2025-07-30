import { useEffect, useState } from 'react'
import { gameSchema } from '@loader/schema/game'
import type { Game } from '@loader/data/game'
import { saveGame } from '../main'

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
      styling,
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
        {Object.entries(game.languages).map(([id, path]) => (
          <div key={id}>
            <input
              type="text"
              value={id}
              onChange={(e) => updateLanguageId(id, e.target.value)}
            />
            <input
              type="text"
              value={path}
              onChange={(e) => updateLanguagePath(id, e.target.value)}
            />
          </div>
        ))}
      </div>
      <div>
        <h2>Pages</h2>
        {Object.entries(game.pages).map(([id, path]) => (
          <div key={id}>
            <input
              type="text"
              value={id}
              onChange={(e) => updatePageId(id, e.target.value)}
            />
            <input
              type="text"
              value={path}
              onChange={(e) => updatePagePath(id, e.target.value)}
            />
          </div>
        ))}
      </div>
      <button type="button" onClick={handleSave}>
        Save
      </button>
    </div>
  )
}

