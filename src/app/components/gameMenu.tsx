import type { GameMenuComponent } from '@loader/data/page'

export type GameMenuProps = {
    component: GameMenuComponent
}

export const GameMenu: React.FC<GameMenuProps> = ({ component }): React.JSX.Element => {
    return (
        <div>{component.type}</div>
    )
}