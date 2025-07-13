export const LogLevel = {
    debug: 0,
    info: 1,
    warning: 2,
    error: 3
} as const
export type LogLevel = typeof LogLevel[keyof typeof LogLevel]

export type CleanUp = () => void

export type Message = {
    message: string
    payload: any
}

export interface IMessageBus {
    postMessage(message: Message): void
    registerMessageListener(message: string, handler: (message: Message) => void): CleanUp
}
