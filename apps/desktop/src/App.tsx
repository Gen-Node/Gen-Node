import { useEffect, useRef, useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { openUrl } from '@tauri-apps/plugin-opener'

type Specs = { os: string; arch: string; cpu: string; cpus: number; mem_gb: number; gpu: string | null; bench: number; fingerprint: string }
type Cfg = { coordinatorUrl: string; nodeId?: string; nodeKey?: string; specs?: Specs }
type Status = { points: number; uptimeSec: number; rank: number; cap: number; online: boolean }

const DEFAULT_COORD = 'https://app.gennode.org'
const HEARTBEAT_MS = 30_000

function loadCfg(): Cfg {
  try {
    return { coordinatorUrl: DEFAULT_COORD, ...JSON.parse(localStorage.getItem('gennode_node') || '{}') }
  } catch {
    return { coordinatorUrl: DEFAULT_COORD }
  }
}
const saveCfg = (c: Cfg) => localStorage.setItem('gennode_node', JSON.stringify(c))
function fmtDur(sec: number) {
  sec = Math.round(sec || 0)
  const d = Math.floor(sec / 86400)
  const h = Math.floor((sec % 86400) / 3600)
  const m = Math.floor((sec % 3600) / 60)
  return d ? `${d}d ${h}h` : h ? `${h}h ${m}m` : `${m}m`
}
const short = (a: string) => (a ? a.slice(0, 6) + '…' + a.slice(-4) : '')

export default function App() {
  const cfg = useRef<Cfg>(loadCfg())
  const timer = useRef<number | null>(null)
  const linkPoll = useRef<number | null>(null)
  const [ready, setReady] = useState(false)
  const [wallet, setWallet] = useState<string | null>(null)
  const [running, setRunning] = useState(false)
  const [specs, setSpecs] = useState<Specs | null>(cfg.current.specs || null)
  const [status, setStatus] = useState<Status | null>(null)
  const [err, setErr] = useState('')
  const [connecting, setConnecting] = useState(false)

  const coord = () => (cfg.current.coordinatorUrl || DEFAULT_COORD).replace(/\/+$/, '')

  async function refreshMe(): Promise<string | null> {
    if (!cfg.current.nodeKey) return null
    try {
      const j = await (await fetch(coord() + '/v1/node/me', { headers: { authorization: 'Bearer ' + cfg.current.nodeKey } })).json()
      if (j.nodeId) {
        setWallet(j.wallet || null)
        setStatus({ points: j.points, uptimeSec: j.uptimeSec, rank: j.rank, cap: j.cap, online: j.online })
        return j.wallet || null
      }
    } catch {
      /* offline */
    }
    return null
  }

  // Register this device on launch (idempotent — one PC = one node), then read wallet/status.
  useEffect(() => {
    ;(async () => {
      try {
        if (!cfg.current.nodeKey) {
          const sp = await invoke<Specs>('get_specs')
          setSpecs(sp)
          cfg.current.specs = sp
          const r = await fetch(coord() + '/v1/node/register', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
              specs: { os: sp.os, arch: sp.arch, cpu: sp.cpu, cpus: sp.cpus, memGB: sp.mem_gb, gpu: sp.gpu },
              bench: sp.bench,
              fingerprint: sp.fingerprint,
            }),
          })
          const j = await r.json()
          if (j.nodeKey) {
            cfg.current.nodeId = j.nodeId
            cfg.current.nodeKey = j.nodeKey
            saveCfg(cfg.current)
          } else {
            throw new Error(j.error || 'registration failed')
          }
        }
        await refreshMe()
      } catch (e) {
        setErr(e instanceof Error ? e.message : String(e))
      }
      setReady(true)
    })()
    return () => {
      if (timer.current) clearInterval(timer.current)
      if (linkPoll.current) clearInterval(linkPoll.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function connectWallet() {
    if (!cfg.current.nodeKey) return
    setErr('')
    setConnecting(true)
    try {
      const j = await (
        await fetch(coord() + '/v1/node/link-start', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ nodeKey: cfg.current.nodeKey }),
        })
      ).json()
      if (!j.url) throw new Error(j.error || 'could not start wallet link')
      await openUrl(j.url)
      if (linkPoll.current) clearInterval(linkPoll.current)
      linkPoll.current = window.setInterval(async () => {
        const w = await refreshMe()
        if (w) {
          setConnecting(false)
          if (linkPoll.current) clearInterval(linkPoll.current)
        }
      }, 3000)
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e))
      setConnecting(false)
    }
  }

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
    if (!wallet) {
      setErr('Connect your wallet first.')
      return
    }
    setRunning(true)
    await beat()
    timer.current = window.setInterval(beat, HEARTBEAT_MS)
  }
  function stop() {
    if (timer.current) clearInterval(timer.current)
    timer.current = null
    setRunning(false)
    setStatus((s) => (s ? { ...s, online: false } : s))
  }

  if (!ready)
    return (
      <div className="app">
        <div className="setup">Setting up your node…</div>
      </div>
    )

  return (
    <div className="app">
      <header>
        <div className="logo">🧬</div>
        <div className="brand">GENNODE</div>
        <div className={'dot ' + (running && status?.online ? 'on' : '')} />
        <div className="state">{running ? (status?.online ? 'online' : 'connecting…') : wallet ? 'ready' : 'not connected'}</div>
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

      {!wallet ? (
        <>
          <button className="big start" onClick={connectWallet} disabled={connecting}>
            {connecting ? 'Waiting for wallet…' : 'Connect wallet'}
          </button>
          <div className="hint">
            Your node won't run until a wallet is connected. A browser tab opens — sign in with Privy (email, social, or
            wallet), then come back here.
          </div>
        </>
      ) : (
        <button className={'big ' + (running ? 'stop' : 'start')} onClick={running ? stop : start}>
          {running ? 'Stop node' : 'Start node'}
        </button>
      )}
      {err && <div className="err">{err}</div>}

      <div className="card">
        <div className="row">
          <span>Wallet</span>
          <b>{wallet ? short(wallet) : '— not connected'}</b>
        </div>
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

      <button className="dash" onClick={() => openUrl('https://app.gennode.org')}>
        Open dashboard ↗
      </button>

      <footer>One device, one node, one wallet · earn $GENNODE for uptime + capacity</footer>
    </div>
  )
}
