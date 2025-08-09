import type { CSSCustomProperties } from '@app/types'
import type { MatrixInputItem } from '@engine/input/inputManager'
import { INPUTHANDLER_INPUTS_CHANGED, VIRTUAL_INPUT_MESSAGE } from '@engine/messages/messages'
import type { InputMatrixComponent } from '@loader/data/component'
import { useEffect, useState } from 'react'
import { useInputManager } from '@app/inputManagerContext'
import { useMessageBus } from '@app/messageBusContext'

export type InputMatrixProps = {
    component: InputMatrixComponent
}

export const InputMatrix: React.FC<InputMatrixProps> = ({ component }): React.JSX.Element => {
    const inputManager = useInputManager()
    const messageBus = useMessageBus()
    const [inputMatrix, setInputMatrix] = useState(inputManager.getInputMatrix(component.matrixSize.width, component.matrixSize.height))
    const style: CSSCustomProperties = {
        '--ge-input-matrix-width': component.matrixSize.width.toString(),
        '--ge-input-matrix-height': component.matrixSize.height.toString()
    }

    useEffect(() => {
        const cleanup = messageBus.registerMessageListener(INPUTHANDLER_INPUTS_CHANGED, () => {
            setInputMatrix(inputManager.getInputMatrix(component.matrixSize.width, component.matrixSize.height))
        })
        return cleanup
    }, [messageBus, inputManager, component.matrixSize.height, component.matrixSize.width])

    const onButtonClick = (item: MatrixInputItem): void => {
        if (!item.enabled || item.virtualInput === '') return
        messageBus.postMessage({ message: VIRTUAL_INPUT_MESSAGE, payload: item.virtualInput })
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
