import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const PORT = Number(process.env.PORT || 8787)
const FREE_CREDITS = Number(process.env.FREE_CREDITS || 25)
const WALLET_BONUS = Number(process.env.WALLET_BONUS || 25)
const DATA_FILE = path.join(__dirname, 'data.json')

// ---- inference providers (OpenAI-compatible upstreams) ----
// venice = private tier (default, for health) · surplus = cheap tier (general/budget)
const PROVIDERS = {
  venice: {
    url: 'https://api.venice.ai/api/v1/chat/completions',
    key: process.env.VENICE_API_KEY || '',
    model: process.env.VENICE_MODEL || 'llama-3.3-70b',
    private: true,
    credits: Number(process.env.VENICE_CREDITS || 2),
  },
  surplus: {
    url: 'https://www.surplusintelligence.ai/api/inference/v1/chat/completions',
    key: process.env.SURPLUS_API_KEY || '',
    model: process.env.SURPLUS_MODEL || 'claude-opus-4.8',
    private: false,
    credits: Number(process.env.SURPLUS_CREDITS || 1),
  },
}
const DEFAULT_PROVIDER = PROVIDERS[process.env.DEFAULT_PROVIDER] ? process.env.DEFAULT_PROVIDER : 'venice'
const TIER_MAP = { private: 'venice', cheap: 'surplus' }
function pickProvider(b) {
  const name = (PROVIDERS[b.provider] && b.provider) || TIER_MAP[b.tier] || DEFAULT_PROVIDER
  return { name, ...PROVIDERS[name] }
}

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
const devices = {} // device-auth: code -> { apiKey, createdAt }

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

  if (pathname === '/health')
    return sendJson(res, 200, { ok: true, default: DEFAULT_PROVIDER, providers: { venice: !!PROVIDERS.venice.key, surplus: !!PROVIDERS.surplus.key } })

  // signup → free credits + a Gennode key
  if (req.method === 'POST' && pathname === '/v1/signup') {
    const b = await readBody(req)
    const apiKey = 'gk_' + crypto.randomBytes(16).toString('hex')
    db.users[apiKey] = { name: (b.name || 'anon').slice(0, 40), credits: FREE_CREDITS, used: 0, createdAt: Date.now() }
    save()
    return sendJson(res, 200, { apiKey, credits: FREE_CREDITS })
  }

  // ---- device auth (terminal opens the dashboard, gets linked automatically) ----
  if (req.method === 'POST' && pathname === '/v1/device/start') {
    const code = crypto.randomBytes(6).toString('hex')
    devices[code] = { apiKey: null, createdAt: Date.now() }
    const base = (process.env.PUBLIC_URL || `http://localhost:${PORT}`).replace(/\/+$/, '')
    return sendJson(res, 200, { code, verifyUrl: `${base}/?code=${code}` })
  }
  if (req.method === 'GET' && pathname === '/v1/device/poll') {
    const d = devices[url.searchParams.get('code')]
    if (!d) return sendJson(res, 404, { error: 'unknown code' })
    return sendJson(res, 200, d.apiKey ? { apiKey: d.apiKey, wallet: db.users[d.apiKey]?.wallet || null } : { pending: true })
  }
  if (req.method === 'POST' && pathname === '/v1/device/approve') {
    const b = await readBody(req)
    const d = devices[b.code]
    if (!d) return sendJson(res, 404, { error: 'unknown code' })
    let apiKey = b.apiKey
    if (!apiKey || !db.users[apiKey]) {
      apiKey = 'gk_' + crypto.randomBytes(16).toString('hex')
      db.users[apiKey] = { name: 'device', credits: FREE_CREDITS, used: 0, createdAt: Date.now() }
      save()
    }
    d.apiKey = apiKey
    return sendJson(res, 200, { ok: true })
  }

  const key = authUser(req)

  // account info
  if (req.method === 'GET' && pathname === '/v1/me') {
    if (!key) return sendJson(res, 401, { error: 'unauthorized' })
    const u = db.users[key]
    return sendJson(res, 200, { name: u.name, credits: u.credits, used: u.used, wallet: u.wallet || null })
  }

  // link a wallet (Privy / injected) to this account → bonus credits; optionally approve a device code
  if (req.method === 'POST' && pathname === '/v1/wallet/link') {
    if (!key) return sendJson(res, 401, { error: 'unauthorized' })
    const b = await readBody(req)
    const address = String(b.address || '').toLowerCase()
    if (!/^0x[0-9a-f]{40}$/.test(address)) return sendJson(res, 400, { error: 'invalid address' })
    const u = db.users[key]
    u.wallet = address
    if (!u.walletBonus) {
      u.credits += WALLET_BONUS
      u.walletBonus = true
    }
    if (b.code && devices[b.code]) devices[b.code].apiKey = key
    save()
    return sendJson(res, 200, { ok: true, wallet: address, credits: u.credits })
  }

  // metered, OpenAI-compatible chat → proxied to Venice
  if (req.method === 'POST' && pathname === '/v1/chat/completions') {
    if (!key) return sendJson(res, 401, { error: 'unauthorized — sign up for a key' })
    const u = db.users[key]

    const b = await readBody(req)
    const messages = Array.isArray(b.messages) ? b.messages : []
    if (!messages.length) return sendJson(res, 400, { error: 'messages required' })

    const prov = pickProvider(b)
    if (!prov.key) return sendJson(res, 500, { error: `provider '${prov.name}' not configured` })
    const cost = prov.credits
    if (u.credits < cost) return sendJson(res, 402, { error: 'out of credits' })

    try {
      const vr = await fetch(prov.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${prov.key}` },
        body: JSON.stringify({ model: b.model || prov.model, messages, temperature: b.temperature ?? 0.4 }),
      })
      const data = await vr.json()
      if (!vr.ok) return sendJson(res, 502, { error: 'provider_error', provider: prov.name, detail: data })
      u.credits -= cost
      u.used += 1
      save()
      return sendJson(res, 200, {
        content: data.choices?.[0]?.message?.content ?? '',
        credits: u.credits,
        provider: prov.name,
        private: prov.private,
      })
    } catch (e) {
      return sendJson(res, 502, { error: 'upstream', detail: String(e) })
    }
  }

  sendJson(res, 404, { error: 'not found' })
})

server.listen(PORT, () => {
  console.log(
    `🧬 Gennode gateway on http://localhost:${PORT}  (default: ${DEFAULT_PROVIDER}, free credits: ${FREE_CREDITS}, venice: ${PROVIDERS.venice.key ? 'set' : '-'}, surplus: ${PROVIDERS.surplus.key ? 'set' : '-'})`,
  )
})
