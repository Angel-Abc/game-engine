import { getGameEngine } from '@engine/gameEngine'
import type { Button } from '@loader/data/button'
import type { GameMenuComponent } from '@loader/data/component'

export type GameMenuProps = {
    component: GameMenuComponent
}

export const GameMenu: React.FC<GameMenuProps> = ({ component }): React.JSX.Element => {
    const engine = getGameEngine()

    const onButtonClick = (button: Button) => {
        engine.executeAction(button.action)
    }

    return (
        <div className='game-menu'>
            {component.buttons.map(button => (
                <button type='button' key={button.label} onClick={() => onButtonClick(button)}>
                    {button.label}
                </button>
            ))}
        </div>
    )
}