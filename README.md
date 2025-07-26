# License

This engine is licensed under the Mozilla Public License 2.0. You can use it freely in commercial and non-commercial projects. Modifications to engine files must remain under the MPL.

## Development

The project uses [Vite](https://vitejs.dev/) with **React** and TypeScript. After installing dependencies run:

```bash
npm run dev
```

for a development server, or build with:

```bash
npm run build
```

The build step copies the game data from the directory specified by the
`GAME_FOLDER` environment variable into `dist/data`. If this variable is not
set, the `sample-game` folder is used.

