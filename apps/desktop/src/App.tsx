import { useEffect, useRef, useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { openUrl } from '@tauri-apps/plugin-opener'

type Specs = { os: string; arch: string; cpu: string; cpus: number; mem_gb: number; gpu: string | null; bench: number }
type Cfg = { coordinatorUrl: string; nodeId?: string; nodeKey?: string; wallet?: string; specs?: Specs }
type Status = { points: number; uptimeSec: number; rank: number; cap: number; online: boolean }

const DEFAULT_COORD = 'https://app.gennode.org'
const HEARTBEAT_MS = 30_000
const ADDR = /^0x[0-9a-fA-F]{40}$/

function loadCfg(): Cfg {
  try {
    const c = JSON.parse(localStorage.getItem('gennode_node') || '{}')
    return { coordinatorUrl: DEFAULT_COORD, ...c }
  } catch {
    return { coordinatorUrl: DEFAULT_COORD }
  }
}
function saveCfg(c: Cfg) {
  localStorage.setItem('gennode_node', JSON.stringify(c))
}
function fmtDur(sec: number) {
  sec = Math.round(sec || 0)
  const d = Math.floor(sec / 86400)
  const h = Math.floor((sec % 86400) / 3600)
  const m = Math.floor((sec % 3600) / 60)
  return d ? `${d}d ${h}h` : h ? `${h}h ${m}m` : `${m}m`
}

export default function App() {
  const cfg = useRef<Cfg>(loadCfg())
  const timer = useRef<number | null>(null)
  const [running, setRunning] = useState(false)
  const [specs, setSpecs] = useState<Specs | null>(cfg.current.specs || null)
  const [status, setStatus] = useState<Status | null>(null)
  const [wallet, setWallet] = useState(cfg.current.wallet || '')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  const coord = () => (cfg.current.coordinatorUrl || DEFAULT_COORD).replace(/\/+$/, '')

  async function beat() {
    if (!cfg.current.nodeKey) return
    try {
      const r = await fetch(coord() + '/v1/node/heartbeat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ nodeKey: cfg.current.nodeKey }),
      })
      const j = await r.json()
      if (j.ok) setStatus({ points: j.points, uptimeSec: j.uptimeSec, rank: j.rank, cap: j.cap, online: true })
    } catch {
      setStatus((s) => (s ? { ...s, online: false } : s))
    }
  }

  async function start() {
    setErr('')
    setBusy(true)
    try {
      if (!cfg.current.nodeKey) {
        if (ADDR.test(wallet.trim())) cfg.current.wallet = wallet.trim().toLowerCase()
        const sp = await invoke<Specs>('get_specs')
        setSpecs(sp)
        cfg.current.specs = sp
        const r = await fetch(coord() + '/v1/node/register', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            wallet: cfg.current.wallet || null,
            specs: { os: sp.os, arch: sp.arch, cpu: sp.cpu, cpus: sp.cpus, memGB: sp.mem_gb, gpu: sp.gpu },
            bench: sp.bench,
            fingerprint: '',
          }),
        })
        const j = await r.json()
        if (!j.nodeKey) throw new Error(j.error || 'registration failed')
        cfg.current.nodeId = j.nodeId
        cfg.current.nodeKey = j.nodeKey
        saveCfg(cfg.current)
      }
      setRunning(true)
      await beat()
      timer.current = window.setInterval(beat, HEARTBEAT_MS)
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e))
    } finally {
      setBusy(false)
    }
  }

  function stop() {
    if (timer.current) {
      clearInterval(timer.current)
      timer.current = null
    }
    setRunning(false)
    setStatus((s) => (s ? { ...s, online: false } : s))
  }

  async function link() {
    const a = wallet.trim().toLowerCase()
    if (!ADDR.test(a)) {
      setErr('Enter a valid 0x… address')
      return
    }
    setErr('')
    cfg.current.wallet = a
    saveCfg(cfg.current)
    if (cfg.current.nodeKey) {
      try {
        await fetch(coord() + '/v1/node/link-wallet', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ nodeKey: cfg.current.nodeKey, address: a }),
        })
      } catch {
        /* will retry on next run */
      }
    }
  }

  useEffect(
    () => () => {
      if (timer.current) clearInterval(timer.current)
    },
    [],
  )

  return (
    <div className="app">
      <header>
        <div className="logo">🧬</div>
        <div className="brand">GENNODE</div>
        <div className={'dot ' + (running && status?.online ? 'on' : '')} />
        <div className="state">{running ? (status?.online ? 'online' : 'connecting…') : 'stopped'}</div>
      </header>

      <div className="stats">
        <div>
          <b>{status ? Math.round(status.points).toLocaleString() : '—'}</b>
          <span>points</span>
        </div>
        <div>
          <b>{status ? fmtDur(status.uptimeSec) : '—'}</b>
          <span>uptime</span>
        </div>
        <div>
          <b>{status ? '#' + status.rank : '—'}</b>
          <span>rank</span>
        </div>
      </div>

      <button className={'big ' + (running ? 'stop' : 'start')} onClick={running ? stop : start} disabled={busy}>
        {busy ? 'Starting…' : running ? 'Stop node' : 'Start node'}
      </button>
      {err && <div className="err">{err}</div>}

      <div className="card">
        <div className="row">
          <span>Node</span>
          <b>{cfg.current.nodeId || '—'}</b>
        </div>
        {specs && (
          <>
            <div className="row">
              <span>CPU</span>
              <b>{specs.cpus}-core</b>
            </div>
            <div className="row">
              <span>GPU</span>
              <b>{specs.gpu || 'none detected'}</b>
            </div>
            <div className="row">
              <span>RAM</span>
              <b>{specs.mem_gb} GB</b>
            </div>
          </>
        )}
        {status && (
          <div className="row">
            <span>Capacity</span>
            <b>×{status.cap}</b>
          </div>
        )}
      </div>

      <div className="card">
        <div className="label">Payout wallet</div>
        <div className="wallet">
          <input value={wallet} onChange={(e) => setWallet(e.target.value)} placeholder="0x…" spellCheck={false} />
          <button onClick={link}>Link</button>
        </div>
        <button className="dash" onClick={() => openUrl('https://app.gennode.org')}>
          Open dashboard ↗
        </button>
      </div>

      <footer>
        Earn $GENNODE for uptime + capacity ·{' '}
        <a href="https://gennode.org" target="_blank" rel="noreferrer">
          gennode.org
        </a>
      </footer>
    </div>
  )
}
