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
- `@loader/*` → `src/loader/*`
- `@resources/*` → `src/resources/*`
- `@engine/*` → `src/engine/*`
- `@styling/*` → `src/styling/*`

## Testing

Run unit tests with [Vitest](https://vitest.dev/):

```bash
npm run test
```

## Game Data Structure

Game content is defined in JSON files loaded at runtime. The root `game.json`
lists all modules and supporting assets:

```json
{
  "title": "Sample Game",
  "description": "A sample game for development",
  "startPage": "pages/start",
  "version": "1.0.0",
  "modules": ["pages/start", "components/game-menu"],
  "translations": ["translations"],
  "inputs": ["inputs"],
  "css": ["css/game.css"],
  "tiles": ["tiles/outdoor", "tiles/now"]
}
```

Each entry in `modules` points to a folder containing an `index.json` file. A
module can be either a **component** or a **page**.

### Component Modules

Component JSON files use the following shape:

```json
{
  "type": "component",
  "description": "The game menu.",
  "data": {
    "type": "game-menu",
    "buttons": [
      {
        "label": "MENU.START-GAME",
        "action": {
          "type": "post-message",
          "message": "SYSTEM.SWITCH-PAGE",
          "payload": { "page": "pages/navigate" }
        }
      }
    ]
  }
}
```

### Page Modules

Page JSON files describe a screen layout and which components appear on it:

```json
{
  "type": "page",
  "description": "The start screen of the game.",
  "screen": { "type": "grid", "rows": 20, "columns": 20 },
  "components": [
    {
      "type": "game-menu",
      "position": { "row": 4, "column": 3, "rowSpan": 8, "columnSpan": 4 }
    }
  ],
  "background-image": "temp-background.png"
}
```

### Translations and Input

Translations are stored under a folder referenced from `game.json`. The
`index.json` file lists supported languages, and each language has an
`index.json` containing a name and key/value translation pairs.

Input mappings are defined in `virtual-keys.json` and `virtual-inputs.json`
files. These map physical key codes to virtual keys and virtual keys to higher
level virtual inputs used by the engine.

Tile data is stored under folders listed in the `tiles` array. Each folder
contains an `index.json` file with a list of tiles:

```json
{
  "tiles": [
    { "key": "outdoor.beach", "description": "OUTDOOR.TILE-BEACH", "color": "yellow" }
  ]
}
```

