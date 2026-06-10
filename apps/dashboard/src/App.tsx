import { useEffect, useRef, useState } from 'react'
import { usePrivy, useWallets } from '@privy-io/react-auth'

type NodeRow = {
  nodeId: string
  points: number
  uptimeSec: number
  cap: number
  online: boolean
  rank: number
  specs?: { cpus?: number; gpu?: string | null; memGB?: number }
}
type Stats = { nodesOnline: number; nodesTotal: number; totalPoints: number }
type LeaderRow = { rank: number; id: string; wallet: string | null; points: number; uptimeSec: number; cap: number; online: boolean }

function fmtDur(sec: number) {
  sec = Math.round(sec || 0)
  const d = Math.floor(sec / 86400)
  const h = Math.floor((sec % 86400) / 3600)
  const m = Math.floor((sec % 3600) / 60)
  return d ? `${d}d ${h}h` : h ? `${h}h ${m}m` : `${m}m`
}
const short = (a: string) => (a ? a.slice(0, 6) + '…' + a.slice(-4) : '')

export default function App() {
  const { ready, authenticated, user, login, logout } = usePrivy()
  const { wallets } = useWallets()
  const [nodes, setNodes] = useState<NodeRow[]>([])
  const [total, setTotal] = useState(0)
  const [stats, setStats] = useState<Stats | null>(null)
  const [leaders, setLeaders] = useState<LeaderRow[]>([])
  const [linkMsg, setLinkMsg] = useState('')
  const timer = useRef<number | null>(null)

  const api = location.origin
  const address = (user?.wallet?.address || wallets[0]?.address || '').toLowerCase()

  async function loadNodes(addr: string) {
    try {
      const j = await (await fetch(api + '/v1/nodes/by-wallet?wallet=' + addr)).json()
      if (j.nodes) {
        setNodes(j.nodes)
        setTotal(j.totalPoints || 0)
      }
    } catch {
      /* ignore */
    }
  }

  useEffect(() => {
    const load = () => {
      fetch(api + '/v1/network/stats')
        .then((r) => r.json())
        .then(setStats)
        .catch(() => {})
      fetch(api + '/v1/leaderboard')
        .then((r) => r.json())
        .then((j) => setLeaders(j.nodes || []))
        .catch(() => {})
    }
    load()
    const t = window.setInterval(load, 30000)
    return () => clearInterval(t)
  }, [api])

  useEffect(() => {
    if (!address) return
    loadNodes(address)
    if (timer.current) clearInterval(timer.current)
    timer.current = window.setInterval(() => loadNodes(address), 30000)

    const code = new URLSearchParams(location.search).get('link')
    if (code) {
      fetch(api + '/v1/node/link-approve', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ code, address }),
      })
        .then((r) => r.json())
        .then((j) => {
          if (j.ok) {
            setLinkMsg('✓ Node linked to your wallet — return to the Gennode app.')
            loadNodes(address)
          } else {
            setLinkMsg('Could not link the node: ' + (j.error || 'unknown'))
          }
        })
        .catch(() => {})
    }
    return () => {
      if (timer.current) clearInterval(timer.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address])

  if (!ready)
    return (
      <div className="app">
        <div className="muted center">Loading…</div>
      </div>
    )

  return (
    <div className="app">
      <header>
        <span className="brand">🧬 GENNODE</span>
        <span className="spacer" />
        {authenticated ? (
          <span className="row">
            <span className="pill">{address ? short(address) : 'no wallet'}</span>
            <button className="ghost" onClick={logout}>
              Log out
            </button>
          </span>
        ) : (
          <button className="primary" onClick={login}>
            Connect
          </button>
        )}
      </header>

      <h1>Your node dashboard</h1>
      <p className="muted">
        Connect with email, a social account, or a wallet. Privy gives you a wallet, and your node's rewards link to it.
      </p>

      {linkMsg && <div className="card accent">{linkMsg}</div>}

      {!authenticated ? (
        <div className="card center">
          <p className="muted">Connect to see your node and points.</p>
          <button className="primary big" onClick={login}>
            Connect with Privy
          </button>
        </div>
      ) : (
        <div className="card">
          <h3>Your node{nodes.length === 1 ? '' : 's'}</h3>
          {nodes.length === 0 ? (
            <p className="muted">
              No node linked to this wallet yet. Run the app, click <b>Connect wallet</b>, and it appears here.
            </p>
          ) : (
            nodes.map((n) => (
              <div key={n.nodeId} className="noderow">
                <div className="nrhead">
                  <span className="mono">{n.nodeId}</span>
                  <span className={n.online ? 'on' : 'off'}>{n.online ? '● online' : '○ offline'}</span>
                </div>
                <div className="stats">
                  <div>
                    <b>{n.points.toLocaleString()}</b>
                    <span>points</span>
                  </div>
                  <div>
                    <b>{fmtDur(n.uptimeSec)}</b>
                    <span>uptime</span>
                  </div>
                  <div>
                    <b>#{n.rank}</b>
                    <span>rank</span>
                  </div>
                  <div>
                    <b>×{n.cap}</b>
                    <span>cap</span>
                  </div>
                </div>
                {n.specs && (
                  <div className="muted small">
                    {(n.specs.cpus ?? '?') + '-core · ' + (n.specs.gpu || 'no GPU') + ' · ' + (n.specs.memGB ?? '?') + 'GB'}
                  </div>
                )}
              </div>
            ))
          )}
          {total > 0 && <p className="muted">Total: {total.toLocaleString()} points</p>}
        </div>
      )}

      <div className="card">
        <h3>Network</h3>
        <div className="stats">
          <div>
            <b>{stats ? stats.nodesOnline : '—'}</b>
            <span>online</span>
          </div>
          <div>
            <b>{stats ? stats.nodesTotal : '—'}</b>
            <span>nodes</span>
          </div>
          <div>
            <b>{stats ? stats.totalPoints.toLocaleString() : '—'}</b>
            <span>points</span>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Leaderboard — top nodes</h3>
        {leaders.length === 0 ? (
          <p className="muted">
            No nodes yet. Be the first — <code>npx @gennode/node</code>.
          </p>
        ) : (
          <table className="lb">
            <thead>
              <tr>
                <th>#</th>
                <th>Node</th>
                <th>Wallet</th>
                <th>Points</th>
                <th>Uptime</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {leaders.map((l) => (
                <tr key={l.id}>
                  <td>{l.rank}</td>
                  <td className="mono">{l.id}</td>
                  <td className="mono muted">{l.wallet || '—'}</td>
                  <td>{l.points.toLocaleString()}</td>
                  <td>{fmtDur(l.uptimeSec)}</td>
                  <td>{l.online ? <span className="on">●</span> : <span className="off">○</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <footer>
        Run a node: <code>npx @gennode/node</code> · <a href="https://gennode.org">gennode.org</a> ·{' '}
        <a href="https://docs.gennode.org">docs</a>
      </footer>
    </div>
  )
}
