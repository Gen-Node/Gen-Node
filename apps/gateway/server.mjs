import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const PORT = Number(process.env.PORT || 8787)
const HEARTBEAT_SEC = Number(process.env.HEARTBEAT_SEC || 30)
const ONLINE_WINDOW_MS = HEARTBEAT_SEC * 2500 // a node counts as online for ~2.5 missed beats
const POINTS_PER_MIN = Number(process.env.POINTS_PER_MIN || 1)
const DATA_FILE = path.join(__dirname, 'data.json')

// ---- tiny JSON store (single-process MVP; swap for SQLite later) ----
function load() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'))
  } catch {
    return { nodes: {} }
  }
}
function save() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2))
}
const db = load()
if (!db.nodes) db.nodes = {} // node network: nodeKey -> node record
const nodeLinks = {} // node wallet-link: code -> { nodeKey, createdAt }
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.json': 'application/json',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.map': 'application/json',
}

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
function authNode(req, body) {
  const h = req.headers.authorization || ''
  const key = h.replace(/^Bearer\s+/i, '').trim() || (body && body.nodeKey) || ''
  return db.nodes[key] ? key : null
}
function capacity(specs = {}) {
  const cpus = Number(specs.cpus) || 1
  const memGB = Number(specs.memGB) || 1
  const gpu = specs.gpu ? 0.8 : 0
  const cap = 0.5 + cpus * 0.12 + memGB * 0.02 + gpu
  return Math.max(0.5, Math.min(4, Number(cap.toFixed(2))))
}
function rankOf(nk) {
  return Object.entries(db.nodes).sort((a, b) => b[1].points - a[1].points).findIndex(([k]) => k === nk) + 1
}

// ---- server (node coordinator + dashboard) ----
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost')
  const { pathname } = url

  if (req.method === 'OPTIONS') {
    res.writeHead(204, CORS)
    return res.end()
  }

  // built React dashboard (apps/dashboard/dist) for all non-API GET requests (SPA fallback)
  if (req.method === 'GET' && !pathname.startsWith('/v1/') && pathname !== '/health') {
    const distDir = path.join(__dirname, '..', 'dashboard', 'dist')
    const rel = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '')
    let file = path.normalize(path.join(distDir, rel))
    if (!file.startsWith(distDir) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      file = path.join(distDir, 'index.html')
    }
    try {
      const data = fs.readFileSync(file)
      res.writeHead(200, {
        'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream',
        'Cache-Control': rel.startsWith('assets/') ? 'public, max-age=31536000, immutable' : 'no-cache',
      })
      return res.end(data)
    } catch {
      return sendJson(res, 500, { error: 'dashboard not built' })
    }
  }

  if (pathname === '/health') return sendJson(res, 200, { ok: true })

  // ---- node network: register / heartbeat / status / wallet link / leaderboard / stats ----
  if (req.method === 'POST' && pathname === '/v1/node/register') {
    const b = await readBody(req)
    const specs = b.specs && typeof b.specs === 'object' ? b.specs : {}
    const bench = Number(b.bench) || 0
    if (bench <= 0) return sendJson(res, 400, { error: 'benchmark required' }) // anti-sybil: prove real hardware
    const wallet = b.wallet ? String(b.wallet).toLowerCase() : null
    if (wallet && !/^0x[0-9a-f]{40}$/.test(wallet)) return sendJson(res, 400, { error: 'invalid wallet' })
    const now = Date.now()
    const fingerprint = String(b.fingerprint || '').slice(0, 64)
    const cleanSpecs = {
      os: String(specs.os || '').slice(0, 24),
      arch: String(specs.arch || '').slice(0, 12),
      cpu: String(specs.cpu || '').slice(0, 64),
      cpus: Number(specs.cpus) || 0,
      memGB: Number(specs.memGB) || 0,
      gpu: specs.gpu ? String(specs.gpu).slice(0, 64) : null,
    }
    // one PC = one node: a device (fingerprint) maps to a single node identity
    if (fingerprint) {
      const existKey = Object.keys(db.nodes).find((k) => db.nodes[k].fingerprint === fingerprint)
      if (existKey) {
        const n = db.nodes[existKey]
        if (wallet && !n.wallet) n.wallet = wallet
        n.specs = cleanSpecs
        n.bench = bench
        n.cap = capacity(cleanSpecs)
        save()
        return sendJson(res, 200, { nodeId: n.nodeId, nodeKey: existKey, cap: n.cap, heartbeatSec: HEARTBEAT_SEC, existing: true })
      }
    }
    const nodeId = 'gn_' + crypto.randomBytes(5).toString('hex')
    const nodeKey = 'nk_' + crypto.randomBytes(20).toString('hex')
    db.nodes[nodeKey] = {
      nodeId, wallet, specs: cleanSpecs, bench, cap: capacity(cleanSpecs),
      fingerprint,
      points: 0, uptimeSec: 0, createdAt: now, lastSeen: now,
    }
    save()
    return sendJson(res, 200, { nodeId, nodeKey, cap: db.nodes[nodeKey].cap, heartbeatSec: HEARTBEAT_SEC })
  }

  if (req.method === 'POST' && pathname === '/v1/node/heartbeat') {
    const b = await readBody(req)
    const nk = authNode(req, b)
    if (!nk) return sendJson(res, 401, { error: 'unknown node' })
    const n = db.nodes[nk]
    const now = Date.now()
    const elapsed = Math.min(now - n.lastSeen, ONLINE_WINDOW_MS) // offline gaps don't farm points
    if (elapsed > 0) {
      n.uptimeSec += Math.round(elapsed / 1000)
      n.points = Number((n.points + (elapsed / 60000) * POINTS_PER_MIN * n.cap).toFixed(2))
    }
    n.lastSeen = now
    if (Number(b.bench) > 0) {
      n.bench = Number(b.bench)
      n.cap = capacity(n.specs)
    }
    save()
    return sendJson(res, 200, { ok: true, points: n.points, uptimeSec: n.uptimeSec, cap: n.cap, rank: rankOf(nk), online: true, intervalSec: HEARTBEAT_SEC })
  }

  if (req.method === 'GET' && pathname === '/v1/node/me') {
    const nk = authNode(req, {})
    if (!nk) return sendJson(res, 401, { error: 'unknown node' })
    const n = db.nodes[nk]
    return sendJson(res, 200, { nodeId: n.nodeId, wallet: n.wallet, specs: n.specs, bench: n.bench, cap: n.cap, points: n.points, uptimeSec: n.uptimeSec, rank: rankOf(nk), online: Date.now() - n.lastSeen < ONLINE_WINDOW_MS })
  }

  if (req.method === 'POST' && pathname === '/v1/node/link-wallet') {
    const b = await readBody(req)
    const nk = authNode(req, b)
    if (!nk) return sendJson(res, 401, { error: 'unknown node' })
    const address = String(b.address || '').toLowerCase()
    if (!/^0x[0-9a-f]{40}$/.test(address)) return sendJson(res, 400, { error: 'invalid address' })
    db.nodes[nk].wallet = address
    save()
    return sendJson(res, 200, { ok: true, wallet: address })
  }

  // node ↔ dashboard wallet link: the app starts a code, the (Privy) dashboard approves it
  if (req.method === 'POST' && pathname === '/v1/node/link-start') {
    const b = await readBody(req)
    const nk = authNode(req, b)
    if (!nk) return sendJson(res, 401, { error: 'unknown node' })
    const code = crypto.randomBytes(4).toString('hex')
    nodeLinks[code] = { nodeKey: nk, createdAt: Date.now() }
    const base = (process.env.PUBLIC_URL || `http://localhost:${PORT}`).replace(/\/+$/, '')
    return sendJson(res, 200, { code, url: `${base}/?link=${code}` })
  }
  if (req.method === 'POST' && pathname === '/v1/node/link-approve') {
    const b = await readBody(req)
    const link = nodeLinks[String(b.code || '')]
    if (!link || Date.now() - link.createdAt > 600000) return sendJson(res, 400, { error: 'invalid or expired code' })
    const address = String(b.address || '').toLowerCase()
    if (!/^0x[0-9a-f]{40}$/.test(address)) return sendJson(res, 400, { error: 'invalid address' })
    const n = db.nodes[link.nodeKey]
    if (!n) return sendJson(res, 404, { error: 'node gone' })
    n.wallet = address
    delete nodeLinks[String(b.code)]
    save()
    return sendJson(res, 200, { ok: true, wallet: address })
  }

  if (req.method === 'GET' && pathname === '/v1/leaderboard') {
    const now = Date.now()
    const nodes = Object.values(db.nodes)
      .sort((a, b) => b.points - a.points)
      .slice(0, 50)
      .map((n, i) => ({
        rank: i + 1, id: n.nodeId,
        wallet: n.wallet ? n.wallet.slice(0, 6) + '…' + n.wallet.slice(-4) : null,
        points: Math.round(n.points), uptimeSec: n.uptimeSec, cap: n.cap,
        online: now - n.lastSeen < ONLINE_WINDOW_MS,
      }))
    return sendJson(res, 200, { nodes })
  }

  if (req.method === 'GET' && pathname === '/v1/network/stats') {
    const now = Date.now()
    const all = Object.values(db.nodes)
    return sendJson(res, 200, {
      nodesTotal: all.length,
      nodesOnline: all.filter((n) => now - n.lastSeen < ONLINE_WINDOW_MS).length,
      totalPoints: Math.round(all.reduce((s, n) => s + n.points, 0)),
      totalUptimeSec: all.reduce((s, n) => s + n.uptimeSec, 0),
    })
  }

  // a wallet's nodes (links the desktop app ↔ dashboard)
  if (req.method === 'GET' && pathname === '/v1/nodes/by-wallet') {
    const wallet = String(url.searchParams.get('wallet') || '').toLowerCase()
    if (!/^0x[0-9a-f]{40}$/.test(wallet)) return sendJson(res, 400, { error: 'invalid wallet' })
    const now = Date.now()
    const allSorted = Object.values(db.nodes).sort((a, b) => b.points - a.points)
    const nodes = allSorted
      .filter((n) => n.wallet === wallet)
      .map((n) => ({
        nodeId: n.nodeId,
        points: Math.round(n.points),
        uptimeSec: n.uptimeSec,
        cap: n.cap,
        online: now - n.lastSeen < ONLINE_WINDOW_MS,
        rank: allSorted.findIndex((x) => x.nodeId === n.nodeId) + 1,
        specs: n.specs,
      }))
    return sendJson(res, 200, { wallet, nodes, totalPoints: nodes.reduce((s, n) => s + n.points, 0) })
  }

  sendJson(res, 404, { error: 'not found' })
})

server.listen(PORT, () => {
  console.log(`🧬 Gennode node coordinator on http://localhost:${PORT}`)
})
