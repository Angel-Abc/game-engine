# Game Engine

This project uses [Vite](https://vitejs.dev/) with React and TypeScript. Hot module replacement is enabled and ESLint is configured with type-aware and React specific rules.

## Getting Started

Run `npm install` or `npm ci` before using `npm run lint` or `npm run build`. These commands need the `node_modules` folder generated from `package-lock.json`.

The development server loads game data from the folder defined by the `GAME_DIR`
environment variable. A default `.env` file is provided pointing to the included
`sample-game` directory, so `npm run dev` works out of the box. To use a different
game located elsewhere on your machine, create an `.env.local` file and set
`GAME_DIR` to the desired path.

## Available Scripts

- `npm run dev` – start the development server
- `npm run build` – create a production build
- `npm run lint` – run ESLint
- `npm run preview` – serve the production build locally
- `npm run test` – run Vitest unit tests

## Path Aliases

You can import modules using the configured aliases:

- `@utility/*` → `src/utility/*`
- `@data/*` → `src/data/*`
- `@app/*` → `src/app/*`

## Testing

Run unit tests with [Vitest](https://vitest.dev/):

```bash
npm run test
```

