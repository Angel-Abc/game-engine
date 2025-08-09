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

When the editor loads, the left side displays a tree. The top node shows the game's title. Below it, the tree lists a section for each data type found in the game (for example, **pages**, **maps**, **tiles**, or **dialogs**). Each section lists its keys as leaves.

The tree uses a clean, indented layout with clickable nodes for easier navigation.

Selecting the **pages** node opens a form in the right pane that lets you create a new page by specifying its ID. The editor saves the page using a path derived from that ID (for example, an ID of `intro` becomes `pages/intro.json`).

## Top Bar

A bar at the top of the editor displays the current save status and includes a **Save** button.
When you click **Save**, the editor POSTs the current game data to `/api/game`.
The status text updates to show `saving`, `saved`, or `error` based on the result.

## Root Page

Selecting the top node in the sidebar shows fields for the title, description, and version. The initial data has been split into separate **Language** and **Start Page** dropdowns.

## Create Page Form

The create page form includes a **Create** button below the fields.
