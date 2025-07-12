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

## `TrackedValue`

```ts
class TrackedValue<T>
```

Maintains an observable value. Use the `value` getter/setter to read or update
the stored value. Call `subscribe(callback)` to be notified whenever the value
changes. A cleanup function is returned to remove the subscription.

