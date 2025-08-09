import { GameMenu } from './gameMenu'
import { Image } from './image'
import { InputMatrix } from './inputMatrix'
import { OutputLog } from './outputLog'
import { SquaresMap } from './squaresMap'
import type { ComponentType } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const componentRegistry: Record<string, ComponentType<any>> = {
    'game-menu': GameMenu,
    'image': Image,
    'squares-map': SquaresMap,
    'input-matrix': InputMatrix,
    'output-log': OutputLog,
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const registerComponent = (type: string, component: ComponentType<any>): void => {
    componentRegistry[type] = component
}

export default componentRegistry
