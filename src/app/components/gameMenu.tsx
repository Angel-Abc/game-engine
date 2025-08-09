import type { Button } from '@loader/data/button'
import type { GameMenuComponent } from '@loader/data/component'
import { useGameEngine } from '@app/engineContext'
import { useTranslationService } from '@app/translationServiceContext'

export type GameMenuProps = {
    component: GameMenuComponent
}

export const GameMenu: React.FC<GameMenuProps> = ({ component }): React.JSX.Element => {
    const engine = useGameEngine()
    const translationService = useTranslationService()

    const onButtonClick = (button: Button) => {
        engine.executeAction(button.action)
    }

    return (
        <div className='game-menu'>
            {component.buttons.map(button => (
                <button type='button' key={button.label} onClick={() => onButtonClick(button)}>
                    {translationService.translate(button.label)}
                </button>
            ))}
        </div>
    )
}
