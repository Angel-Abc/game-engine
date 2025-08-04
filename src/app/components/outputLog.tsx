import { ScrollContainer } from '@app/controls/scrollContainer'
import { getGameEngine } from '@engine/gameEngine'
import { OUTPUT_LOG_LINE_ADDED } from '@engine/messages'
import type { OutputComponent } from '@loader/data/component'
import { useEffect, useState } from 'react'

export type OutputLogProps = {
    component: OutputComponent
}

export const OutputLog: React.FC<OutputLogProps> = ({ component }): React.JSX.Element => {
    const engine = getGameEngine()
    const [outputLog, setOutputLog] = useState<string>(engine.OutputManager.getLastLines(component.logSize).join(' '))

    useEffect(() => {
        const cleanup = engine.MessageBus.registerMessageListener(OUTPUT_LOG_LINE_ADDED, () => {
            setOutputLog(engine.OutputManager.getLastLines(component.logSize).join(' '))
        })
        return cleanup
    }, [engine])

    return (
        <ScrollContainer className='output-log' html={outputLog} />
    )
}