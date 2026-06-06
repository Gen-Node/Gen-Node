import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const PORT = Number(process.env.PORT || 8787)
const VENICE_API_KEY = process.env.VENICE_API_KEY || ''
const VENICE_URL = 'https://api.venice.ai/api/v1/chat/completions'
const MODEL = process.env.GATEWAY_MODEL || 'llama-3.3-70b'
const FREE_CREDITS = Number(process.env.FREE_CREDITS || 25)
const DATA_FILE = path.join(__dirname, 'data.json')

// ---- tiny JSON store (single-process MVP; swap for SQLite later) ----
function load() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'))
  } catch {
    return { users: {} }
  }
}
function save() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2))
}
const db = load()

// ---- helpers ----
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}
function sendJson(res, status, obj) {
  res.writeHead(status, { 'Content-Type': 'application/json', ...CORS })
  res.end(JSON.stringify(obj))
}
function readBody(req) {
  return new Promise((resolve) => {
    let d = ''
    req.on('data', (c) => (d += c))
    req.on('end', () => {
      try {
        resolve(d ? JSON.parse(d) : {})
      } catch {
        resolve({})
      }
    })
  })
}
function authUser(req) {
  const h = req.headers.authorization || ''
  const key = h.replace(/^Bearer\s+/i, '').trim()
  return db.users[key] ? key : null
}

// ---- server ----
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost')
  const { pathname } = url

  if (req.method === 'OPTIONS') {
    res.writeHead(204, CORS)
    return res.end()
  }

  // dashboard
  if (req.method === 'GET' && (pathname === '/' || pathname === '/dashboard')) {
    try {
      const html = fs.readFileSync(path.join(__dirname, 'public', 'dashboard.html'), 'utf8')
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
      return res.end(html)
    } catch {
      return sendJson(res, 500, { error: 'dashboard missing' })
    }
  }

  if (pathname === '/health') return sendJson(res, 200, { ok: true, model: MODEL, configured: !!VENICE_API_KEY })

  // signup → free credits + a Gennode key
  if (req.method === 'POST' && pathname === '/v1/signup') {
    const b = await readBody(req)
    const apiKey = 'gk_' + crypto.randomBytes(16).toString('hex')
    db.users[apiKey] = { name: (b.name || 'anon').slice(0, 40), credits: FREE_CREDITS, used: 0, createdAt: Date.now() }
    save()
    return sendJson(res, 200, { apiKey, credits: FREE_CREDITS })
  }

  const key = authUser(req)

  // account info
  if (req.method === 'GET' && pathname === '/v1/me') {
    if (!key) return sendJson(res, 401, { error: 'unauthorized' })
    const u = db.users[key]
    return sendJson(res, 200, { name: u.name, credits: u.credits, used: u.used })
  }

  // metered, OpenAI-compatible chat → proxied to Venice
  if (req.method === 'POST' && pathname === '/v1/chat/completions') {
    if (!key) return sendJson(res, 401, { error: 'unauthorized — sign up for a key' })
    const u = db.users[key]
    if (u.credits <= 0) return sendJson(res, 402, { error: 'out of credits' })
    if (!VENICE_API_KEY) return sendJson(res, 500, { error: 'gateway not configured (set VENICE_API_KEY)' })

    const b = await readBody(req)
    const messages = Array.isArray(b.messages) ? b.messages : []
    if (!messages.length) return sendJson(res, 400, { error: 'messages required' })

    try {
      const vr = await fetch(VENICE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${VENICE_API_KEY}` },
        body: JSON.stringify({ model: b.model || MODEL, messages, temperature: b.temperature ?? 0.4 }),
      })
      const data = await vr.json()
      if (!vr.ok) return sendJson(res, 502, { error: 'venice_error', detail: data })
      u.credits -= 1
      u.used += 1
      save()
      return sendJson(res, 200, {
        content: data.choices?.[0]?.message?.content ?? '',
        credits: u.credits,
      })
    } catch (e) {
      return sendJson(res, 502, { error: 'upstream', detail: String(e) })
    }
  }

  sendJson(res, 404, { error: 'not found' })
})

server.listen(PORT, () => {
  console.log(`🧬 Gennode gateway on http://localhost:${PORT}  (model: ${MODEL}, free credits: ${FREE_CREDITS}, venice: ${VENICE_API_KEY ? 'set' : 'MISSING'})`)
})
