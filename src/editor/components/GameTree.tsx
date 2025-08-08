import type { JSX } from 'react'
import { useEditorContext } from '@editor/context/EditorContext'
import type { NodePath } from '@editor/context/EditorContext'
import type { Game } from '../data/game'

export interface GameTreeViewProps {
  game: Game
  selectedPath: NodePath
  onSelect: (path: NodePath) => void
}

function pathsEqual(a: NodePath, b: NodePath): boolean {
  return a.length === b.length && a.every((seg, i) => seg === b[i])
}

function renderRecord(
  record: Record<string, unknown>,
  path: NodePath,
  onSelect: (p: NodePath) => void,
  selectedPath: NodePath,
): JSX.Element {
  return (
    <ul>
      {Object.entries(record).map(([key, value]) => {
        const nextPath = [...path, key]
        const selected = pathsEqual(nextPath, selectedPath)
        return (
          <li key={key}>
            <button
              type="button"
              onClick={() => onSelect(nextPath)}
              className={selected ? 'selected' : undefined}
            >
              {key}
            </button>
            {renderValue(value, nextPath, onSelect, selectedPath)}
          </li>
        )
      })}
    </ul>
  )
}

function renderArray(
  arr: unknown[],
  path: NodePath,
  onSelect: (p: NodePath) => void,
  selectedPath: NodePath,
): JSX.Element {
  return (
    <ul>
      {arr.map((value, index) => {
        const label = typeof value === 'string' ? value : String(index)
        const nextPath = [...path, label]
        const selected = pathsEqual(nextPath, selectedPath)
        return (
          <li key={label}>
            <button
              type="button"
              onClick={() => onSelect(nextPath)}
              className={selected ? 'selected' : undefined}
            >
              {label}
            </button>
            {renderValue(value, nextPath, onSelect, selectedPath)}
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
  selectedPath: NodePath,
): JSX.Element | null {
  if (Array.isArray(value)) {
    return renderArray(value, path, onSelect, selectedPath)
  }
  if (typeof value === 'object' && value !== null) {
    return renderRecord(value as Record<string, unknown>, path, onSelect, selectedPath)
  }
  return null
}

export const GameTreeView: React.FC<GameTreeViewProps> = ({
  game,
  selectedPath,
  onSelect,
}) => {
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
  return renderRecord(root, [], onSelect, selectedPath)
}
export const GameTree: React.FC = () => {
  const { game, selectedPath, setSelectedPath } = useEditorContext()

  if (!game) {
    return <div>Loading...</div>
  }
  return (
    <div className="editor-tree">
      <GameTreeView
        game={game}
        selectedPath={selectedPath}
        onSelect={setSelectedPath}
      />
    </div>
  )
}

export default GameTree

