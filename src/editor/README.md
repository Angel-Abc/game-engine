# Editor

Launch the editor separately from the main development server:

- macOS/Linux
  ```bash
  npm run dev:editor
  ```
- Windows PowerShell
  ```powershell
  npm run dev:editor
  ```
- Windows Command Prompt
  ```cmd
  npm run dev:editor
  ```

This command serves the editor on [http://localhost:5174/editor.html](http://localhost:5174/editor.html).

## Saving and Loading

The editor loads game data and persists changes through functions in
[`src/editor/api/game.ts`](./api/game.ts). The module exposes `loadGame`
and `saveGame`, which use the Fetch API under the hood.
