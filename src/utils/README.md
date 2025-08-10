# Utilities

A small collection of helper functions used across the engine.

## Available functions

- **create2DArray**: Creates a two-dimensional array filled with an initial value.
- **logMessage / logDebug / logInfo / logWarning / fatalError**: Utility logging helpers that format and output messages with a chosen log level.
- **hasMapChanged**: Compares two maps using a custom equality check and reports if they differ.
- **updateMap**: Replaces the contents of one map with cloned entries from another.
- **setValueAtPath**: Sets a value on an object given a dot separated path.
- **loadJsonResource**: Fetches a JSON resource from a URL and validates it using a Zod schema.
- **MessageBus**: Lightweight publish/subscribe queue that delivers posted messages to registered listeners.
- **MessageQueue**: Internal queue used by `MessageBus` to manage pending messages.
- **TrackedValue**: Observable wrapper for a value that notifies subscribers when it changes.
- **CleanUp / Message**: Helper types used by other utilities.
