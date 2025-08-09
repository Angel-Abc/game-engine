# Editor Manual

## Launch the Editor

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

This command serves the editor on http://localhost:5174/editor.html.

## Sidebar Tree

When the editor loads, the left side displays a tree. The top node shows the game's title. Underneath are the **pages**, **maps**, **tiles**, and **dialogs** nodes. Each of these nodes lists their respective keys as leaves.

Selecting the **pages** node opens a form in the right pane that lets you create a new page by specifying its ID and file name. If the file name is left blank, the editor suggests one based on the entered ID (for example, an ID of `intro` results in a suggested file name of `pages/intro.json`).

