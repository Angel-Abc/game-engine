import { GameMenu } from '@app/components/gameMenu'
import { Image } from '@app/components/image'
import type { Component as ComponentData } from '@loader/data/component'

export type ComponentProps = {
    component: ComponentData
}

export const Component:React.FC<ComponentProps> = ({ component }): React.JSX.Element => {
    switch(component.type){
        case 'game-menu':
            return <GameMenu component={component} />
        case 'image':
            return <Image component={component} />
    }
}