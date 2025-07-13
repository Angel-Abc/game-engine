# Utility Functions

This folder contains helper functions used throughout the project.

## `loadJsonResource`

```ts
async function loadJsonResource<T>(url: string, schema: ZodType<T>): Promise<T>
```

Fetches a JSON resource from the provided URL, validates it using a given
[zod](https://github.com/colinhacks/zod) schema and returns the parsed data.
Throws an error if the request fails, the JSON cannot be parsed or the schema
validation does not succeed.

## `logMessage`

```ts
logMessage(level: LogLevel, message: string, ...args: unknown[]): string
```

Logs a formatted message to the console using the specified log level. Utility
wrappers `logDebug`, `logInfo`, `logWarning` and `fatalError` are also provided
for convenience.

## `MessageBus`

```ts
class MessageBus implements IMessageBus
```

A simple publish/subscribe message queue. Register listeners for specific
message strings using `registerMessageListener()`. Posted messages are routed to
matching listeners in the order they were enqueued. Queue processing can be
temporarily paused with `disableEmptyQueueAfterPost()` and resumed with
`enableEmptyQueueAfterPost()`.

## `TrackedValue`

```ts
class TrackedValue<T>
```

Maintains an observable value. Use the `value` getter/setter to read or update
the stored value. Call `subscribe(callback)` to be notified whenever the value
changes. A cleanup function is returned to remove the subscription.

## Utility Types

The `types.ts` module exposes a few shared interfaces and enums:

```ts
const LogLevel = { debug: 0, info: 1, warning: 2, error: 3 } as const
type LogLevel = typeof LogLevel[keyof typeof LogLevel]

interface IMessageBus {
  postMessage(message: Message): void
  registerMessageListener(message: string, handler: (message: Message) => void): CleanUp
}

type Message = {
  message: string
  payload: number | string | Record<string, unknown>
}
```

These can be imported using the `@utility/*` path alias.

