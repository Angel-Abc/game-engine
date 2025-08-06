import { LogLevel, type LogLevel as LogLevelType, isCategoryEnabled, isLevelEnabled } from './logConfig'

function formatMessageForConsole(
    message: string,
    ...args: unknown[]
): { formattedMessage: string; extraArgs: unknown[] } {
    // This array will hold any arguments that should be passed separately to the console.
    const extraArgs: unknown[] = []

    // Replace placeholders in the message with either their string value or with a console format specifier.
    // We use a regex to find all placeholders like {0}, {1}, etc.
    const formattedMessage = message.replace(/\{(\d+)\}/g, (_: string, indexStr: string) => {
        const index = parseInt(indexStr, 10)
        const arg: unknown = args[index]

        // If the argument is an object (or not a primitive), use '%o' as the placeholder
        // and push the object into extraArgs to be passed to the console.
        if (typeof arg === 'object' && arg !== null) {
            extraArgs.push(arg)
            return '%o'
        }

        // Otherwise, simply convert the argument to a string.
        return String(arg)
    })

    return { formattedMessage, extraArgs }
}

export function logMessage(
    logLevel: LogLevelType,
    category: string | undefined,
    message: string,
    ...args: unknown[]
): string {
    const { formattedMessage, extraArgs } = formatMessageForConsole(message, ...args)
    if (!isLevelEnabled(logLevel)) return formattedMessage
    if (logLevel === LogLevel.debug && !isCategoryEnabled(category)) return formattedMessage

    const finalMessage = category ? `[${category}] ${formattedMessage}` : formattedMessage

    switch (logLevel) {
        case LogLevel.debug:
            console.debug('\x1B[37m' + finalMessage, ...extraArgs)
            break
        case LogLevel.info:
            console.info('\x1B[30m' + finalMessage, ...extraArgs)
            break
        case LogLevel.warning:
            console.warn('\x1B[1m\x1B[33m' + finalMessage, ...extraArgs)
            break
        case LogLevel.error:
            console.error('\x1B[1m\x1B[31m' + finalMessage, ...extraArgs)
            break
        default:
            console.log(finalMessage, ...extraArgs)
            break
    }

    return finalMessage
}

function createLogger(level: LogLevelType) {
    return (categoryOrMessage: string, messageOrArg?: unknown, ...args: unknown[]): string => {
        if (typeof messageOrArg === 'string') {
            return logMessage(level, categoryOrMessage, messageOrArg, ...args)
        }
        const params = messageOrArg === undefined ? args : [messageOrArg, ...args]
        return logMessage(level, undefined, categoryOrMessage, ...params)
    }
}

export const logDebug = createLogger(LogLevel.debug)
export const logInfo = createLogger(LogLevel.info)
export const logWarning = createLogger(LogLevel.warning)
export function fatalError(categoryOrMessage: string, messageOrArg?: unknown, ...args: unknown[]): never {
    if (typeof messageOrArg === 'string') {
        throw new Error(logMessage(LogLevel.error, categoryOrMessage, messageOrArg, ...args))
    }
    const params = messageOrArg === undefined ? args : [messageOrArg, ...args]
    throw new Error(logMessage(LogLevel.error, undefined, categoryOrMessage, ...params))
}
