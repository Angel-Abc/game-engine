import { GameMenu } from '@app/components/gameMenu'
import type { Component as ComponentData } from '@loader/data/page'

export type ComponentProps = {
    component: ComponentData
}

export const Component:React.FC<ComponentProps> = ({ component }): React.JSX.Element => {
    switch(component.type){
        case 'game-menu':
            return <GameMenu component={component} />
    }
}