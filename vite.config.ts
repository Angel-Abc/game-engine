import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import copy from 'rollup-plugin-copy'
import { fileURLToPath, URL } from 'node:url'

const gameFolder = process.env.GAME_FOLDER || 'sample-game'

export default defineConfig({
  plugins: [
    react(),
    copy({
      targets: [
        { src: 'resources', dest: 'dist', rename: 'res' },
        { src: gameFolder, dest: 'dist', rename: 'data' },
      ],
      hook: 'writeBundle',
      verbose: true,
    }),
  ],
  resolve: {
    alias: {
      '@utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
    },
  },
})
