import type { IGameEngine } from '@engine/core/gameEngine'
import type { Button } from '@loader/data/button'
import type { GameMenuComponent } from '@loader/data/component'

export type GameMenuProps = {
    component: GameMenuComponent
    engine: IGameEngine
}

export const GameMenu: React.FC<GameMenuProps> = ({ component, engine }): React.JSX.Element => {

    const onButtonClick = (button: Button) => {
        engine.executeAction(button.action)
    }

    return (
        <div className='game-menu'>
            {component.buttons.map(button => (
                <button type='button' key={button.label} onClick={() => onButtonClick(button)}>
                    {engine.TranslationService.translate(button.label)}
                </button>
            ))}
        </div>
    )
}
