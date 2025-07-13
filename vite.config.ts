import { defineConfig, normalizePath } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import path from 'node:path'
import { viteStaticCopy } from 'vite-plugin-static-copy'

// https://vite.dev/config/
const marketValueDataDir = fileURLToPath(new URL('../market-value/data', import.meta.url))

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: normalizePath(path.join(marketValueDataDir, '**/*')),
          dest: 'data',
          rename: (_name, _ext, fullPath) => {
            const rel = normalizePath(path.relative(marketValueDataDir, fullPath))
            return rel
          },
        },
      ],
      structured: false,
      silent: true,
    }),
  ],
  resolve: {
    alias: {
      '@utility': fileURLToPath(new URL('./src/utility', import.meta.url)),
      '@data': fileURLToPath(new URL('./src/data', import.meta.url)),
      '@app': fileURLToPath(new URL('./src/app', import.meta.url)),
    },
  },
})
