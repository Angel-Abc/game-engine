# License

This engine is licensed under the Mozilla Public License 2.0. You can use it freely in commercial and non-commercial projects. Modifications to engine files must remain under the MPL.

## Development

The project uses [Vite](https://vitejs.dev/) with **React** and TypeScript. After installing dependencies run:

```bash
npm run dev
```

for a development server, or start the JSON editor with:

```bash
npm run dev:editor
```

Build with:

```bash
npm run build
```

The build step copies the game data from the directory specified by the
`GAME_FOLDER` environment variable into `dist/data`. If this variable is not
set, the `sample-game` folder is used.

During development the same files are served via `vite-plugin-static-copy`,
allowing JSON resources from `resources/` or your game folder to be accessible
while running `npm run dev`.

## Testing

Run the unit tests once with:

```bash
npm test
```

