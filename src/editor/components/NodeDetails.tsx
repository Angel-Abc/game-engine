import type { FC } from 'react'
import { useEditorContext } from '@editor/context/EditorContext'

import GameDetails from './node-details/GameDetails'
import PageDetails from './node-details/PageDetails'
import MapDetails from './node-details/MapDetails'
import TileDetails from './node-details/TileDetails'
import DialogDetails from './node-details/DialogDetails'
import HandlerDetails from './node-details/HandlerDetails'
import VirtualKeyDetails from './node-details/VirtualKeyDetails'
import VirtualInputDetails from './node-details/VirtualInputDetails'
import LanguageDetails from './node-details/LanguageDetails'

const componentMap: Record<string, FC<{ id: string }>> = {
  pages: PageDetails,
  maps: MapDetails,
  tiles: TileDetails,
  dialogs: DialogDetails,
  handlers: HandlerDetails,
  virtualKeys: VirtualKeyDetails,
  virtualInputs: VirtualInputDetails,
  languages: LanguageDetails,
}

export const NodeDetails: FC = () => {
  const { game, selectedPath } = useEditorContext()

  if (!game) {
    return <div>Select a node</div>
  }

  const path = selectedPath[0] === 'game' ? selectedPath.slice(1) : selectedPath

  if (path.length === 0) {
    return <GameDetails />
  }

  if (path.length < 2) {
    return <div>Select a node</div>
  }

  const [category, id] = path
  const Component = componentMap[category]

  if (!Component) {
    return <div>Unsupported node type</div>
  }

  return <Component id={id} />
}

export default NodeDetails
