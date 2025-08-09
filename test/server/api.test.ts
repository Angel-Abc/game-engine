import { describe, it, expect, vi } from 'vitest'
import supertest from 'supertest'
import { createApp } from '../../src/server/index.js'

const validGame = {
  title: 't',
  description: 'd',
  version: '1',
  'initial-data': { language: 'en', 'start-page': 'start-page' },
  languages: {},
  pages: {},
  maps: {},
  tiles: {},
  dialogs: {},
  styling: [],
  handlers: [],
  'virtual-keys': [],
  'virtual-inputs': [],
}

describe('server api', () => {
  it('GET /api/game returns parsed json', async () => {
    const fsMock = {
      readFile: vi.fn((_path: string, _enc: string, cb: (err: Error | null, data?: string) => void) => cb(null, '{"a":1}')),
      writeFile: vi.fn()
    } as any
    const app = createApp(fsMock)

    await supertest(app).get('/api/game').expect(200, { a: 1 })
  })

  it('GET /api/game handles read errors', async () => {
    const fsMock = {
      readFile: vi.fn((_p: string, _e: string, cb: (err: Error | null, data?: string) => void) => cb(new Error('fail'))),
      writeFile: vi.fn()
    } as any
    const app = createApp(fsMock)

    const res = await supertest(app).get('/api/game')
    expect(res.status).toBe(500)
    expect(res.body).toEqual({ error: 'Failed to read game' })
  })

  it('POST /api/game saves data', async () => {
    const fsMock = {
      readFile: vi.fn(),
      writeFile: vi.fn((_p: string, _data: string, _enc: string, cb: (err: Error | null) => void) => cb(null))
    } as any
    const app = createApp(fsMock)

    await supertest(app).post('/api/game').send(validGame).expect(200, { ok: true })
    expect(fsMock.writeFile).toHaveBeenCalled()
  })

  it('POST /api/game rejects invalid data', async () => {
    const fsMock = {
      readFile: vi.fn(),
      writeFile: vi.fn()
    } as any
    const app = createApp(fsMock)

    const res = await supertest(app).post('/api/game').send({ ...validGame, title: 1 })
    expect(res.status).toBe(400)
    expect(res.body[0].path).toEqual(['title'])
    expect(fsMock.writeFile).not.toHaveBeenCalled()
  })

  it('POST /api/game handles write errors', async () => {
    const fsMock = {
      readFile: vi.fn(),
      writeFile: vi.fn((_p: string, _data: string, _enc: string, cb: (err: Error | null) => void) => cb(new Error('fail')))
    } as any
    const app = createApp(fsMock)

    const res = await supertest(app).post('/api/game').send(validGame)
    expect(res.status).toBe(500)
    expect(res.body).toEqual({ error: 'Failed to save game' })
  })

  it('GET /api/map/:path returns parsed json', async () => {
    const fsMock = {
      readFile: vi.fn((_p: string, _e: string, cb: (err: Error | null, data?: string) => void) => cb(null, '{"m":1}')),
      writeFile: vi.fn(),
    } as any
    const app = createApp(fsMock)

    await supertest(app)
      .get(`/api/map/${encodeURIComponent('maps/test.json')}`)
      .expect(200, { m: 1 })
  })

  it('POST /api/map/:path saves data', async () => {
    const fsMock = {
      readFile: vi.fn(),
      writeFile: vi.fn((_p: string, _d: string, _e: string, cb: (err: Error | null) => void) => cb(null)),
    } as any
    const app = createApp(fsMock)

    await supertest(app)
      .post(`/api/map/${encodeURIComponent('maps/test.json')}`)
      .send({ n: 2 })
      .expect(200, { ok: true })
    expect(fsMock.writeFile).toHaveBeenCalled()
  })
})
