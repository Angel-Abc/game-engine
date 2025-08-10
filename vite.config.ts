import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'node:path'

const gameFolder = process.env.GAME_FOLDER || 'sample-game'
const rootDir = fileURLToPath(new URL('.', import.meta.url))
const withEditor = process.env.WITH_EDITOR !== 'false'

export default defineConfig({
  envPrefix: ['VITE_', 'LOG_'],
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        { src: `${gameFolder}/**/*`, dest: 'data' },
      ],
      watch: {
        reloadPageOnChange: true,
      },
    }),
  ],
  resolve: {
    alias: {
      '@app': fileURLToPath(new URL('./src/app', import.meta.url)),
      '@engine': fileURLToPath(new URL('./src/engine', import.meta.url)),
      '@loader': fileURLToPath(new URL('./src/loader', import.meta.url)),
      '@utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
      '@editor': fileURLToPath(new URL('./src/editor', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      input: {
        index: resolve(rootDir, 'index.html'),
        ...(withEditor ? { editor: resolve(rootDir, 'editor.html') } : {}),
      },
    },
  },
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
})
