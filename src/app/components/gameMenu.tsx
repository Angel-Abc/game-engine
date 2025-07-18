import { getGameEngine } from '@engine/gameEngine'
import type { GameMenuData, Button } from '@data/game/component'
import type { Message } from '@utility/types'

export type GameMenuProps = {
    data: GameMenuData
}

const GameMenu: React.FC<GameMenuProps> = ({ data }): React.JSX.Element => {
    const engine = getGameEngine()

    const onButtonClick = (button: Button) => {
        if (button.action.type === 'post-message') {
            const msg: Message = {
                message: button.action.message,
                payload: button.action.payload ?? null,
            }
            engine.postMessage(msg)
        }
    }

    return (
        <div className='game-menu'>
            {data.buttons.map((b, idx) => (
                <button key={idx} onClick={() => onButtonClick(b)}>
                    {engine.translate(b.label, 'en')}
                </button>
            ))}
        </div>
    )
}

export default GameMenu
