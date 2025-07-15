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
  }
})


