/* global process, console */
// eslint-env node
import express from 'express'
import fs from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { gameSchema } from '../loader/schema/game.ts'

export function createApp(fsModule = fs) {
  const app = express()
  app.use(express.json())

  const gameFolder = process.env.GAME_FOLDER || 'sample-game'
  const __dirname = dirname(fileURLToPath(import.meta.url))
  const gamePath = join(__dirname, '..', '..', gameFolder, 'index.json')

  app.get('/api/game', (req, res) => {
    fsModule.readFile(gamePath, 'utf-8', (err, data) => {
      if (err) {
        res.status(500).json({ error: 'Failed to read game' })
        return
      }
      try {
        const json = JSON.parse(data)
        res.json(json)
      } catch {
        res.status(500).json({ error: 'Invalid JSON' })
      }
    })
  })

  app.post('/api/game', (req, res) => {
    const parsed = gameSchema.safeParse(req.body)
    if (!parsed.success) {
      res.status(400).json(parsed.error.issues)
      return
    }
    const jsonString = JSON.stringify(req.body, null, 2)
    fsModule.writeFile(gamePath, jsonString, 'utf-8', (err) => {
      if (err) {
        res.status(500).json({ error: 'Failed to save game' })
        return
      }
      res.json({ ok: true })
    })
  })

  app.get('/api/map/:path', (req, res) => {
    const file = req.params.path
    const mapPath = join(__dirname, '..', '..', gameFolder, file)
    fsModule.readFile(mapPath, 'utf-8', (err, data) => {
      if (err) {
        res.status(500).json({ error: 'Failed to read map' })
        return
      }
      try {
        const json = JSON.parse(data)
        res.json(json)
      } catch {
        res.status(500).json({ error: 'Invalid JSON' })
      }
    })
  })

  app.post('/api/map/:path', (req, res) => {
    const file = req.params.path
    const mapPath = join(__dirname, '..', '..', gameFolder, file)
    const jsonString = JSON.stringify(req.body, null, 2)
    fsModule.writeFile(mapPath, jsonString, 'utf-8', (err) => {
      if (err) {
        res.status(500).json({ error: 'Failed to save map' })
        return
      }
      res.json({ ok: true })
    })
  })

  return app
}

if (!process.env.VITEST) {
  const app = createApp()
  const port = process.env.PORT || 3001
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
  })
}
