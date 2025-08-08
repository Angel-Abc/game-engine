# Getting Started for Game Developers

This guide helps you build a new game with this engine. It focuses on using the engine, not modifying it.

## Run the Sample Game

1. Install [Node.js](https://nodejs.org/) (v18 or later). On Windows, download and run the installer from the Node.js website.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Launch the development server. The sample game is used by default:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser to play the sample game.

### Build the Sample Game

Create an optimized build:
```bash
npm run build
```
The output appears in the `dist/` directory.

## Start Your Own Game

1. Copy the sample game as a starting point:
   * macOS/Linux
     ```bash
     cp -r sample-game my-game
     ```
   * Windows PowerShell
     ```powershell
     Copy-Item -Recurse sample-game my-game
     ```
   * Windows Command Prompt
     ```cmd
     xcopy /E /I sample-game my-game
     ```
2. Point the engine to your game folder during development or build:
   * macOS/Linux
     ```bash
     export GAME_FOLDER=my-game
     npm run dev    # or npm run build
     ```
   * Windows PowerShell
     ```powershell
     $env:GAME_FOLDER="my-game"
     npm run dev    # or npm run build
     ```
   * Windows Command Prompt
     ```cmd
     set GAME_FOLDER=my-game && npm run dev    # or npm run build
     ```
3. Edit the JSON files, images, and other assets in your game folder. The dev server reloads when files change.
4. Build with `GAME_FOLDER` set to your game folder when you're ready to deploy. The `dist/` folder contains the final files you can host.
