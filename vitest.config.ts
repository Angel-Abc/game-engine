import { defineConfig } from 'vitest/config'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  test: {
    environment: 'jsdom',
  },
  resolve: {
    alias: {
      '@utility': fileURLToPath(new URL('./src/utility', import.meta.url)),
      '@data': fileURLToPath(new URL('./src/data', import.meta.url)),
      '@app': fileURLToPath(new URL('./src/app', import.meta.url)),
      '@engine': fileURLToPath(new URL('./src/engine', import.meta.url)),
      '@styling': fileURLToPath(new URL('./src/styling', import.meta.url)),
    },
  },
})
