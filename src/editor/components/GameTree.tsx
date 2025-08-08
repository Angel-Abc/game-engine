import { useEffect, useState } from 'react'
import type { JSX } from 'react'
import type { Game } from '../data/game'
import { fetchGame } from '../services/api'

export type NodePath = string[]

export interface GameTreeViewProps {
  game: Game
  onSelect: (path: NodePath) => void
}

function renderRecord(
  record: Record<string, unknown>,
  path: NodePath,
  onSelect: (p: NodePath) => void,
): JSX.Element {
  return (
    <ul>
      {Object.entries(record).map(([key, value]) => (
        <li key={key}>
          <button type="button" onClick={() => onSelect([...path, key])}>
            {key}
          </button>
          {renderValue(value, [...path, key], onSelect)}
        </li>
      ))}
    </ul>
  )
}

function renderArray(
  arr: unknown[],
  path: NodePath,
  onSelect: (p: NodePath) => void,
): JSX.Element {
  return (
    <ul>
      {arr.map((value, index) => {
        const label = typeof value === 'string' ? value : String(index)
        const nextPath = [...path, label]
        return (
          <li key={label}>
            <button type="button" onClick={() => onSelect(nextPath)}>
              {label}
            </button>
            {renderValue(value, nextPath, onSelect)}
          </li>
        )
      })}
    </ul>
  )
}

function renderValue(
  value: unknown,
  path: NodePath,
  onSelect: (p: NodePath) => void,
): JSX.Element | null {
  if (Array.isArray(value)) {
    return renderArray(value, path, onSelect)
  }
  if (typeof value === 'object' && value !== null) {
    return renderRecord(value as Record<string, unknown>, path, onSelect)
  }
  return null
}

export const GameTreeView: React.FC<GameTreeViewProps> = ({ game, onSelect }) => {
  const root: Record<string, unknown> = {
    pages: game.pages,
    maps: game.maps,
    tiles: game.tiles,
    dialogs: game.dialogs,
    handlers: game.handlers,
    virtualKeys: game.virtualKeys,
    virtualInputs: game.virtualInputs,
    languages: game.languages,
  }
  return renderRecord(root, [], onSelect)
}

export interface GameTreeProps {
  onSelect: (path: NodePath) => void
  fetchFn?: typeof fetchGame
}

export const GameTree: React.FC<GameTreeProps> = ({ onSelect, fetchFn = fetchGame }) => {
  const [game, setGame] = useState<Game | null>(null)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const controller = new AbortController()
    fetchFn(controller.signal)
      .then((data) => setGame(data.game))
      .catch((err: Error) => setError(err.message))
    return () => controller.abort()
  }, [fetchFn])

  if (error) {
    return <div>{error}</div>
  }
  if (!game) {
    return <div>Loading...</div>
  }
  return <GameTreeView game={game} onSelect={onSelect} />
}

export default GameTree

