import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import copy from 'rollup-plugin-copy'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [
    react(),
    copy({
      targets: [
        { src: 'resources', dest: 'dist', rename: 'res' },
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
