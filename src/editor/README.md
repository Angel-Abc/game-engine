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

## Page Editor

Selecting a page in the sidebar opens a visual editor with dedicated fields for
the page **id**, **inputs**, and **screen**:

- The **Id** field is a simple text input.
- The **Inputs** and **Screen** fields accept JSON and validate it against the
  project's schemas using the shared [`JsonEditor`](./components/JsonEditor.tsx)
  component.

Click **Apply** to validate and persist your changes or **Cancel** to revert to
the original values.
