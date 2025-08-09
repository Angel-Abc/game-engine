# License

This engine is licensed under the Mozilla Public License 2.0. You can use it freely in commercial and non-commercial projects. Modifications to engine files must remain under the MPL.

## Development

The project uses [Vite](https://vitejs.dev/) with **React** and TypeScript. After installing dependencies run:

```bash
npm run dev
```

for a development server on port `5173`, or start the JSON editor with:

```bash
npm run dev:editor
```

This command serves the editor on port `5174`.

Build with:

```bash
npm run build
```

To build without including the editor, run:

```bash
npm run build:release
```

The build step copies the game data from the directory specified by the
`GAME_FOLDER` environment variable into `dist/data`. If this variable is not
set, the `sample-game` folder is used.

On Windows, set the variable before running the build:

```cmd
set GAME_FOLDER=path\to\your\game && npm run build
```

```powershell
$env:GAME_FOLDER='path\\to\\your\\game'; npm run build
```

Windows users may need to use `set`, PowerShell's `$env:` syntax, or a tool like
[`cross-env`](https://github.com/kentcdodds/cross-env) when running npm
scripts that rely on environment variables.

During development the same files are served via `vite-plugin-static-copy`,
allowing JSON resources from `resources/` or your game folder to be accessible
while running `npm run dev`.

## Game API Server

The editor communicates with a small Express server that reads and writes the
`index.json` file of your game. Start it together with the dev server using:

```bash
npm run dev
```

or run it separately with:

```bash
npm run dev:server
```

The server uses the `GAME_FOLDER` environment variable to determine where the
game data lives. If not set, it defaults to `sample-game`.

## Testing

Run the unit tests once with:

```bash
npm test
```

## Logging

Control log output with environment variables:

- `LOG_LEVEL` sets the minimum level that will be emitted (`debug`, `info`, `warning`, `error`). It defaults to `info`.
- `LOG_DEBUG` enables debug messages for specific categories. Provide a comma-separated list such as `MessageBus,MapManager`.

Examples:

```bash
# enable all debug logs
LOG_LEVEL=debug npm run dev

# Command Prompt
set LOG_LEVEL=debug && npm run dev

# PowerShell
$env:LOG_LEVEL='debug'; npm run dev

# enable debug logs only for MessageBus and MapManager
LOG_LEVEL=debug LOG_DEBUG=MessageBus,MapManager npm run dev

# Command Prompt
set LOG_LEVEL=debug && set LOG_DEBUG=MessageBus,MapManager && npm run dev

# PowerShell
$env:LOG_LEVEL='debug'; $env:LOG_DEBUG='MessageBus,MapManager'; npm run dev
```

