import type { CSSCustomProperties } from '@app/types'
import { getGameEngine } from '@engine/gameEngine'
import type { MatrixInputItem } from '@engine/inputManager'
import { INPUTHANDLER_INPUTS_CHANGED, VIRTUAL_INPUT_MESSAGE } from '@engine/messages'
import type { inputMatrixComponent } from '@loader/data/component'
import { useEffect, useState } from 'react'

export type InputMatrixProps = {
    component: inputMatrixComponent
}

export const InputMatrix: React.FC<InputMatrixProps> = ({ component }): React.JSX.Element => {
    const engine = getGameEngine()
    const [inputMatrix, setInputMatrix] = useState(engine.InputManager.getInputMatrix(component.matrixSize.width, component.matrixSize.height))
    const style: CSSCustomProperties = {
        '--ge-input-matrix-width': component.matrixSize.width.toString(),
        '--ge-input-matrix-height': component.matrixSize.height.toString()
    }

    useEffect(() => {
        const cleanup = engine.MessageBus.registerMessageListener(INPUTHANDLER_INPUTS_CHANGED, () => {
            setInputMatrix(engine.InputManager.getInputMatrix(component.matrixSize.width, component.matrixSize.height))
        })
        return cleanup
    }, [engine, component.matrixSize.height, component.matrixSize.width])

    const onButtonClick = (item: MatrixInputItem): void => {
        if (!item.enabled || item.virtualInput === '') return
        engine.MessageBus.postMessage({ message: VIRTUAL_INPUT_MESSAGE, payload: item.virtualInput })
    }


    let keyCounter = 0
    return (
        <div className='input-matrix' style={style}>
            {inputMatrix.map(row => {
                return (
                    <div key={`row_${keyCounter++}`}>
                        {row.map(item => {
                            const isEmpty = item.label === ''
                            const label = isEmpty ? '' : `${item.character} - ${item.label}`
                            return (
                                <button key={`row_${keyCounter++}`} disabled={!item.enabled || isEmpty} type="button" onClick={() => onButtonClick(item)}>
                                    {label}
                                </button>
                            )
                        })}
                    </div>
                )
            })}
        </div>
    )
}