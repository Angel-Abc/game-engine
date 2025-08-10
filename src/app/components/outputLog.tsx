import { ScrollContainer } from '@app/controls/scrollContainer'
import { OUTPUT_LOG_LINE_ADDED } from '@engine/messages/messages'
import type { OutputComponent } from '@loader/data/component'
import { useEffect, useState } from 'react'
import { useOutputManager } from '@app/outputManagerContext'
import { useMessageBus } from '@app/messageBusContext'

export type OutputLogProps = {
    component: OutputComponent
}

export const OutputLog: React.FC<OutputLogProps> = ({ component }): React.JSX.Element => {
    const outputManager = useOutputManager()
    const messageBus = useMessageBus()
    const [outputLog, setOutputLog] = useState<string>(outputManager.getLastLines(component.logSize).join(' '))

    useEffect(() => {
        const cleanup = messageBus.registerMessageListener(OUTPUT_LOG_LINE_ADDED, () => {
            setOutputLog(outputManager.getLastLines(component.logSize).join(' '))
        })
        return cleanup
    }, [messageBus, outputManager, component.logSize])

    return (
        <ScrollContainer className='output-log' html={outputLog} />
    )
}
