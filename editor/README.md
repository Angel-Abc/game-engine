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

The editor maintains its own TypeScript definition for game data. Import the `Game` interface from `@editor/data/game`
when extending editor features to ensure type safety.

The tree view includes a top-level `game` node. Selecting this node lets you edit global settings such as the game title and description.
