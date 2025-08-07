import type React from 'react'
import type { Game } from '@loader/data/game'
import { useGameData } from '../hooks/useGameData'
import { useGameTabs } from '../hooks/useGameTabs'
import { GameForm } from './GameForm'
import { MapEditorPanel } from './MapEditorPanel'

export const GameEditor: React.FC = () => {
  const {
    game,
    setGame,
    styling,
    setStyling,
    statusMessage,
    setStatusMessage,
    loadError,
    saving,
    save,
  } = useGameData()

  const {
    tab,
    setTab,
    editingMap,
    editingTiles,
    openMapEditor,
    handleMapSave,
  } = useGameTabs(game, setStatusMessage)

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
        <GameForm
          game={game}
          setGame={setGame as React.Dispatch<React.SetStateAction<Game>>}
          styling={styling}
          setStyling={setStyling}
          openMapEditor={openMapEditor}
          onSave={save}
          saving={saving}
        />
      )}
      {tab === 'map' && editingMap && (
        <MapEditorPanel
          key={editingMap.key}
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
