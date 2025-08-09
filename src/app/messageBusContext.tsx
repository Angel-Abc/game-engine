import { createContext, useContext, type ReactNode } from 'react'
import type { IMessageBus } from '@utils/messageBus'

const MessageBusContext = createContext<IMessageBus | null>(null)

export const MessageBusProvider: React.FC<{ messageBus: IMessageBus, children: ReactNode }> = ({ messageBus, children }) => (
  <MessageBusContext.Provider value={messageBus}>{children}</MessageBusContext.Provider>
)

export const useMessageBus = (): IMessageBus => {
  const messageBus = useContext(MessageBusContext)
  if (messageBus === null) {
    throw new Error('useMessageBus must be used within a MessageBusProvider')
  }
  return messageBus
}

export default MessageBusContext
