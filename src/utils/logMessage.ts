export const LogLevel = {
    debug: 0,
    info: 1,
    warning: 2,
    error: 3
} as const
export type LogLevel = typeof LogLevel[keyof typeof LogLevel]

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
    logLevel: LogLevel,
    message: string,
    ...args: unknown[]
): string {
    // Prepare the message and extra arguments for console logging.
    const { formattedMessage, extraArgs } = formatMessageForConsole(message, ...args)

    // Log using the appropriate console method.
    switch (logLevel) {
        case LogLevel.debug:
            console.debug('\x1B[37m' + formattedMessage, ...extraArgs)
            break
        case LogLevel.info:
            console.info('\x1B[30m' + formattedMessage, ...extraArgs)
            break
        case LogLevel.warning:
            console.warn('\x1B[1m\x1B[33m' + formattedMessage, ...extraArgs)
            break
        case LogLevel.error:
            console.error('\x1B[1m\x1B[31m' + formattedMessage, ...extraArgs)
            break
        default:
            console.log(formattedMessage, ...extraArgs)
            break
    }

    return formattedMessage
}

export function logDebug(message: string, ...args: unknown[]): string {
    return logMessage(LogLevel.debug, message, ...args)
}

export function logInfo(message: string, ...args: unknown[]): string {
    return logMessage(LogLevel.info, message, ...args)
}

export function logWarning(message: string, ...args: unknown[]): string {
    return logMessage(LogLevel.warning, message, ...args)
}

export function fatalError(message: string, ...args: unknown[]): never {
    throw new Error(logMessage(LogLevel.error, message, ...args))
}
