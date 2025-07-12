import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { viteStaticCopy } from 'vite-plugin-static-copy'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'data/**/*',
          dest: '.',
        },
      ],
      structured: true,
    }),
  ],
  resolve: {
    alias: {
      '@utility': fileURLToPath(new URL('./src/utility', import.meta.url)),
    },
  },
})
