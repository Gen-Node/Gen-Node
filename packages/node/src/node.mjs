// Gennode node engine — register, benchmark, heartbeat, earn points.
// No dependencies: uses global fetch + node builtins.
import os from 'node:os'
import crypto from 'node:crypto'
import { execFile } from 'node:child_process'

const HEARTBEAT_MS = 30_000
const DEFAULT_COORDINATOR = (process.env.GENNODE_COORDINATOR || 'https://app.gennode.org').replace(/\/+$/, '')

// ---- hardware ----
export function collectSpecs() {
  const cpus = os.cpus() || []
  return {
    os: os.platform(),
    arch: os.arch(),
    cpu: (cpus[0]?.model || 'unknown').replace(/\s+/g, ' ').trim(),
    cpus: cpus.length,
    memGB: Math.max(1, Math.round(os.totalmem() / 1e9)),
    gpu: null, // filled by detectGpu()
  }
}

// best-effort NVIDIA GPU detection; resolves null if unavailable (never throws/hangs)
export function detectGpu() {
  return new Promise((resolve) => {
    let done = false
    const finish = (v) => {
      if (!done) {
        done = true
        resolve(v)
      }
    }
    const t = setTimeout(() => finish(null), 2600)
    try {
      execFile('nvidia-smi', ['--query-gpu=name', '--format=csv,noheader'], { timeout: 2500 }, (err, stdout) => {
        clearTimeout(t)
        if (err || !stdout) return finish(null)
        finish((stdout.split('\n')[0] || '').trim() || null)
      })
    } catch {
      clearTimeout(t)
      finish(null)
    }
  })
}

// hashes/sec of a 1KB buffer — proves a real CPU (anti-sybil) + a capacity signal
export function benchmark(ms = 500) {
  const buf = crypto.randomBytes(1024)
  const end = Date.now() + ms
  let n = 0
  while (Date.now() < end) {
    for (let i = 0; i < 200; i++) crypto.createHash('sha256').update(buf).digest()
    n += 200
  }
  return Math.round(n / (ms / 1000))
}

export function fingerprint(specs) {
  let user = 'u'
  try {
    user = os.userInfo().username
  } catch {}
  const raw = [os.hostname(), user, specs.cpu, specs.arch, specs.cpus, specs.memGB].join('|')
  return crypto.createHash('sha256').update(raw).digest('hex').slice(0, 32)
}

// ---- net ----
async function post(u, body) {
  try {
    const r = await fetch(u, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) })
    return await r.json()
  } catch (e) {
    return { error: String(e.message || e) }
  }
}
async function get(u, key) {
  try {
    const r = await fetch(u, { headers: key ? { authorization: 'Bearer ' + key } : {} })
    return await r.json()
  } catch (e) {
    return { error: String(e.message || e) }
  }
}

// ---- format ----
function fmtDur(sec) {
  sec = Math.round(sec || 0)
  const d = Math.floor(sec / 86400)
  const h = Math.floor((sec % 86400) / 3600)
  const m = Math.floor((sec % 3600) / 60)
  return d ? `${d}d${h}h` : h ? `${h}h${m}m` : `${m}m`
}
const fmtPts = (p) => Math.round(p || 0).toLocaleString()
function printSpecs(s, bench, cap) {
  console.log(`   ${s.cpus}-core ${s.cpu}`)
  console.log(`   ${s.memGB} GB RAM · ${s.gpu ? 'GPU: ' + s.gpu : 'GPU: none detected'} · ${s.os}/${s.arch}`)
  console.log(`   benchmark ${Number(bench).toLocaleString()} h/s${cap ? ` · capacity ×${cap}` : ''}`)
}
function coordOf(cfg) {
  return (cfg.coordinatorUrl || DEFAULT_COORDINATOR).replace(/\/+$/, '')
}

// ---- commands ----
export async function runNode(cfg, saveConfig) {
  const url = coordOf(cfg)

  if (!cfg.nodeKey) {
    process.stdout.write('Detecting hardware…')
    const specs = collectSpecs()
    specs.gpu = await detectGpu()
    const bench = benchmark()
    process.stdout.write(' done.\n')
    const reg = await post(url + '/v1/node/register', { wallet: cfg.wallet || null, specs, bench, fingerprint: fingerprint(specs) })
    if (!reg.nodeKey) {
      console.error('\n✗ Registration failed:', reg.error || 'unknown', `\n   (coordinator: ${url})`)
      process.exitCode = 1
      return
    }
    cfg.coordinatorUrl = url
    cfg.nodeId = reg.nodeId
    cfg.nodeKey = reg.nodeKey
    cfg.specs = specs
    cfg.bench = bench
    saveConfig(cfg)
    console.log(`\n🧬 Node registered — ${reg.nodeId}`)
    printSpecs(specs, bench, reg.cap)
  } else {
    console.log(`\n🧬 Gennode node — ${cfg.nodeId}`)
    if (cfg.specs) printSpecs(cfg.specs, cfg.bench || 0, null)
  }

  if (!cfg.wallet) {
    console.log('\n⚠  No wallet linked. Run "gennode wallet 0x…" (or link at app.gennode.org) to claim rewards.')
  }
  console.log('\nNode running — earning points for uptime + capacity. Press Ctrl+C to stop.\n')

  const beat = async () => {
    const r = await post(url + '/v1/node/heartbeat', { nodeKey: cfg.nodeKey })
    if (r && r.ok) {
      const line = `● online    ${fmtPts(r.points)} pts    up ${fmtDur(r.uptimeSec)}    rank #${r.rank}    ×${r.cap}`
      process.stdout.write('\r' + line.padEnd(72))
    } else if (r && r.error) {
      process.stdout.write('\r⚠ ' + String(r.error).padEnd(62))
    } else {
      process.stdout.write('\r◌ reconnecting…'.padEnd(62))
    }
  }

  await beat()
  const timer = setInterval(beat, HEARTBEAT_MS)
  let stopping = false
  const shutdown = () => {
    if (stopping) return
    stopping = true
    clearInterval(timer)
    console.log('\n\n🛑 Node stopped — your points are saved. Run "gennode node" to resume.')
    process.exit(0)
  }
  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)
}

export async function nodeStatus(cfg) {
  if (!cfg.nodeKey) return console.log('No node yet. Run "gennode node" to start one.')
  const r = await get(coordOf(cfg) + '/v1/node/me', cfg.nodeKey)
  if (r.error) return console.log('Error:', r.error)
  console.log(`\n🧬 Node ${r.nodeId}   ${r.online ? '● online' : '○ offline'}`)
  console.log(`   points  ${fmtPts(r.points)}    uptime ${fmtDur(r.uptimeSec)}    rank #${r.rank}    capacity ×${r.cap}`)
  console.log(`   wallet  ${r.wallet || '— (run: gennode wallet 0x…)'}\n`)
}

export async function linkWallet(cfg, saveConfig, address) {
  address = String(address || '').toLowerCase()
  if (!/^0x[0-9a-f]{40}$/.test(address)) return console.log('Usage: gennode wallet 0x…  (a valid EVM address)')
  cfg.wallet = address
  saveConfig(cfg)
  if (cfg.nodeKey) {
    const r = await post(coordOf(cfg) + '/v1/node/link-wallet', { nodeKey: cfg.nodeKey, address })
    if (r.ok) return console.log('✓ Wallet linked to your node: ' + address)
    return console.log('Saved locally; will link on next run. (' + (r.error || '') + ')')
  }
  console.log('✓ Wallet saved: ' + address + ' — run "gennode node" to start earning.')
}
