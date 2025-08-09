import React, { useState } from 'react'
import type { GameData } from '../types'
import styles from './gameEditor.module.css'

export const GameEditor: React.FC<{ game: GameData }> = ({ game }) => {
  const [title, setTitle] = useState(game.title)
  const [description, setDescription] = useState(game.description ?? '')
  const [version, setVersion] = useState(game.version ?? '')
  const [language, setLanguage] = useState(
    game['initial-data']?.language ?? ''
  )
  const [startPage, setStartPage] = useState(
    game['initial-data']?.['start-page'] ?? ''
  )

  const languages = Object.keys(game.languages ?? {})
  const pages = Object.keys(game.pages ?? {})

  return (
    <form className={styles.form}>
      <label>
        Title
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>
      <label>
        Description
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>
      <label>
        Version
        <input
          type="text"
          value={version}
          onChange={(e) => setVersion(e.target.value)}
        />
      </label>
      <label>
        Language
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
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
          value={startPage}
          onChange={(e) => setStartPage(e.target.value)}
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
