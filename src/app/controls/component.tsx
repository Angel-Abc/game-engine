import { GameMenu } from '@app/components/gameMenu'
import { Image } from '@app/components/image'
import { InputMatrix } from '@app/components/inputMatrix'
import { OutputLog } from '@app/components/outputLog'
import { SquaresMap } from '@app/components/squaresMap'
import type { Component as ComponentData } from '@loader/data/component'
import type { IGameEngine } from '@engine/core/gameEngine'

export type ComponentProps = {
    component: ComponentData
    engine: IGameEngine
}

export const Component:React.FC<ComponentProps> = ({ component, engine }): React.JSX.Element => {
    switch(component.type){
        case 'game-menu':
            return <GameMenu component={component} engine={engine} />
        case 'image':
            return <Image component={component} />
        case 'squares-map':
            return <SquaresMap component={component} engine={engine} />
        case 'input-matrix':
            return <InputMatrix component={component} engine={engine} />
        case 'output-log':
            return <OutputLog component={component} engine={engine} />
        default:
            return <div>TODO: {component.type}</div>
    }
}
