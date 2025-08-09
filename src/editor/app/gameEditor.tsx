import React from 'react'
import type { GameData } from '../types'
import styles from './gameEditor.module.css'

interface GameEditorProps {
  game: GameData
  onChange: (game: GameData) => void
}

export const GameEditor: React.FC<GameEditorProps> = ({ game, onChange }) => {
  const languages = Object.keys(game.languages ?? {})
  const pages = Object.keys(game.pages ?? {})

  const handleTitleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    onChange({ ...game, title: e.target.value })
  }

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ): void => {
    onChange({ ...game, description: e.target.value })
  }

  const handleVersionChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    onChange({ ...game, version: e.target.value })
  }

  const handleLanguageChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ): void => {
    onChange({
      ...game,
      ['initial-data']: {
        ...(game['initial-data'] ?? {}),
        language: e.target.value,
      },
    })
  }

  const handleStartPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ): void => {
    onChange({
      ...game,
      ['initial-data']: {
        ...(game['initial-data'] ?? {}),
        ['start-page']: e.target.value,
      },
    })
  }

  return (
    <form className={styles.form}>
      <label>
        Title
        <input type="text" value={game.title} onChange={handleTitleChange} />
      </label>
      <label>
        Description
        <textarea
          value={game.description ?? ''}
          onChange={handleDescriptionChange}
        />
      </label>
      <label>
        Version
        <input
          type="text"
          value={game.version ?? ''}
          onChange={handleVersionChange}
        />
      </label>
      <label>
        Language
        <select
          value={game['initial-data']?.language ?? ''}
          onChange={handleLanguageChange}
        >
          <option value="">Select language</option>
          {languages.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </label>
      <label>
        Start Page
        <select
          value={game['initial-data']?.['start-page'] ?? ''}
          onChange={handleStartPageChange}
        >
          <option value="">Select start page</option>
          {pages.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </label>
    </form>
  )
}
