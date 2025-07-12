# Game Engine

This project uses [Vite](https://vitejs.dev/) with React and TypeScript. Hot module replacement is enabled and ESLint is configured with type-aware and React specific rules.

## Getting Started

Run `npm install` or `npm ci` before using `npm run lint` or `npm run build`. These commands need the `node_modules` folder generated from `package-lock.json`.

## Available Scripts

- `npm run dev` – start the development server
- `npm run build` – create a production build
- `npm run lint` – run ESLint
- `npm run preview` – serve the production build locally

## Path Aliases

You can import utility modules and shared types using the configured aliases:

- `@utility/*` → `src/utility/*`

