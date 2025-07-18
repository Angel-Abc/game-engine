import { defineConfig, loadEnv, normalizePath } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import path from 'node:path'
import { viteStaticCopy } from 'vite-plugin-static-copy'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const gameDir = env.GAME_DIR || 'sample-game'
  const gameDataDir = fileURLToPath(new URL(gameDir, import.meta.url))
  const resourcesDir = fileURLToPath(new URL('./src/resources', import.meta.url))

  return {
    plugins: [
      react(),
      viteStaticCopy({
        targets: [
          {
            src: normalizePath(path.join(gameDataDir, '**/*')),
            dest: 'data',
            rename: (_name, _ext, fullPath) => {
              const rel = normalizePath(path.relative(gameDataDir, fullPath))
              return rel
            },
          },
          {
            src: normalizePath(path.join(resourcesDir, '**/*')),
            dest: 'resources',
            rename: (_name, _ext, fullPath) => {
              const rel = normalizePath(path.relative(resourcesDir, fullPath))
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
        '@loader': fileURLToPath(new URL('./src/loader', import.meta.url)),
        '@resources': fileURLToPath(new URL('./src/resources', import.meta.url)),
        '@engine': fileURLToPath(new URL('./src/engine', import.meta.url)),
        '@styling': fileURLToPath(new URL('./src/styling', import.meta.url)),
      },
    },
  }
})


