import { useEffect, useRef, useState } from 'react'
import DNA from './components/DNA'
import Model3D from './components/Model3D'
import Intro from './components/Intro'

const X_URL = 'https://x.com/gennode'
const DOCS_URL = 'https://docs.gennode.org'

function Pill({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full chalk-border px-3 py-1 text-xs text-white/80">
      <span className="h-2 w-2 rounded-full" style={{ background: color, boxShadow: `0 0 10px ${color}` }} />
      {label}
    </span>
  )
}

function Reveal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0, rootMargin: '0px 0px -12% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        shown ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
      }`}
    >
      {children}
    </div>
  )
}

function MotifDNA({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 168" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M16 6 C48 32, 48 52, 16 80 C-16 108, -16 134, 16 162" />
      <path d="M48 6 C16 32, 16 52, 48 80 C80 108, 80 134, 48 162" />
      <path d="M19 24 H45 M14 44 H50 M19 64 H45 M19 104 H45 M14 124 H50 M19 144 H45" strokeWidth="1.1" opacity="0.8" />
    </svg>
  )
}

function MotifMolecule({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
      <path
        d="M60 22 L100 48 M100 48 L86 94 M86 94 L34 94 M34 94 L20 48 M20 48 L60 22 M60 22 L60 60 M100 48 L60 60 M86 94 L60 60 M34 94 L60 60 M20 48 L60 60"
        strokeWidth="1.1"
        opacity="0.85"
      />
      <circle cx="60" cy="22" r="5.5" />
      <circle cx="100" cy="48" r="5.5" />
      <circle cx="86" cy="94" r="5.5" />
      <circle cx="34" cy="94" r="5.5" />
      <circle cx="20" cy="48" r="5.5" />
      <circle cx="60" cy="60" r="6.5" />
    </svg>
  )
}

const problems = [
  { t: 'Compute is expensive', d: 'Protein folding, genomics and drug discovery are not lightweight — they need serious GPU power.' },
  { t: 'Health data is huge & sensitive', d: 'A single genome is ~100GB. Storing it on someone else’s server is a privacy risk.' },
  { t: 'Generic networks aren’t enough', d: 'Most DePIN sells empty GPU hours to anyone — none are built for private bio & health data.' },
]

const steps = [
  { n: '01', t: 'Download', d: 'Get the Gennode app for macOS, Windows or Linux. One click, like Ollama.', tag: 'Soon', live: false },
  { n: '02', t: 'Connect wallet', d: 'Link a wallet — your node identity. Keeps the network sybil-resistant and fair.', tag: 'Soon', live: false },
  { n: '03', t: 'Run a node', d: 'Your idle GPU joins the network and stays online. It runs quietly in the tray.', tag: 'Soon', live: false },
  { n: '04', t: 'Earn $GENNODE', d: 'Earn points for uptime + capacity. Points convert to $GENNODE in the airdrop.', tag: 'Soon', live: false },
]

const roadmap = [
  { p: 'Phase 1', t: 'Node app + points', d: 'Desktop node (Mac/Win/Linux), wallet, uptime → points, leaderboard.', state: 'now' },
  { p: 'Phase 2', t: 'Token launch', d: '$GENNODE fair launch on Base via Bankr. Season 1 points open.', state: 'next' },
  { p: 'Phase 3', t: 'Airdrop & growth', d: 'Points → $GENNODE airdrop. Referrals, staking, holder boosts.', state: 'next' },
  { p: 'Phase 4', t: 'Real compute', d: 'Nodes run real jobs (AI inference) with proof-of-compute & paying demand.', state: 'coming' },
  { p: 'Phase 5', t: 'Bio-compute', d: 'DNA, protein folding & genomics jobs. Genes meet nodes.', state: 'coming' },
]

const supply = [
  { label: 'Public liquidity — fair launch', pct: 100 },
  { label: 'Team / insiders', pct: 0 },
  { label: 'Dev buy / pre-mine', pct: 0 },
]

function Section({ id, children, className = '' }: { id?: string; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} className={`mx-auto w-full max-w-6xl px-6 ${className}`}>
      {children}
    </section>
  )
}

function Nav() {
  const links = [
    ['Run a node', '#run'],
    ['How it works', '#how'],
    ['Token', '#token'],
    ['Roadmap', '#roadmap'],
  ]
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-ink/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#top" className="flex items-center gap-2">
          <img
            src="/logo.png"
            onError={(e) => {
              e.currentTarget.src = '/dna.svg'
            }}
            alt="Gennode"
            className="h-8 w-8 rounded-sm"
          />
          <span className="text-lg font-bold tracking-wide">GENNODE</span>
        </a>
        <nav className="hidden items-center gap-7 md:flex">
          {links.map(([label, href]) => (
            <a key={href} href={href} className="text-sm text-white/65 transition hover:text-white">
              {label}
            </a>
          ))}
        </nav>
        <a href="#run" className="btn btn-primary px-4 py-2 text-sm">
          Run a node
        </a>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <div id="top" className="relative overflow-hidden">
      {/* 3D DNA backdrop */}
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 md:block">
        <DNA />
      </div>

      <Section className="relative z-10 pb-24 pt-20 md:pt-28">
        <div className="max-w-2xl fade-up">
          <div className="mb-5 flex flex-wrap gap-3">
            <Pill color="#22d3ee" label="Network: building" />
            <Pill color="#818cf8" label="100% fair launch" />
          </div>

          <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">
            Run a node,
            <br />
            <span className="font-chalk text-6xl text-bluex glow-text md:text-7xl">earn $GENNODE.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg text-white/70">
            Download Gennode, connect your wallet, and put your <strong className="text-white">idle GPU + storage</strong> to
            work for a private network for <strong className="text-white">deep health &amp; DNA data</strong> — genomics,
            protein folding, drug discovery, AI. Earn while it runs. Mac · Windows · Linux.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <a href="#run" className="btn btn-primary px-6 py-3">
              Run a node
            </a>
            <a href="#waitlist" className="btn btn-ghost px-6 py-3">
              Join the airdrop →
            </a>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/55">
            <span>💻 Mac · Windows · Linux</span>
            <span>🟢 Earn while idle</span>
            <span>🛡 Fair launch</span>
            <span>⛓ Built on Base</span>
          </div>

          <p className="mt-5 text-xs text-white/40">Node app coming soon · $GENNODE not yet launched.</p>
        </div>
      </Section>

      {/* mobile DNA */}
      <div className="pointer-events-none mx-auto h-72 w-full max-w-sm md:hidden">
        <DNA />
      </div>
    </div>
  )
}

function Problem() {
  return (
    <Section id="problem" className="py-20">
      <div className="text-center">
        <h2 className="font-chalk text-4xl text-white/90 md:text-5xl">The Problem</h2>
        <p className="mt-2 text-white/60">Biological AI needs serious compute — and the market has three gaps.</p>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {problems.map((p, i) => (
          <div key={p.t} className="card p-6">
            <div className="mb-3 font-chalk text-2xl text-bluex">0{i + 1}</div>
            <h3 className="text-lg font-semibold">{p.t}</h3>
            <p className="mt-2 text-sm text-white/60">{p.d}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-bluex/25 bg-bluex/5 p-7 text-center glow-text">
        <p className="text-sm uppercase tracking-widest text-white/50">Gennode is built for one vertical</p>
        <p className="font-chalk text-5xl text-bluex md:text-6xl">BIO-COMPUTE</p>
        <p className="mt-1 text-white/60">A node-powered compute layer for biological AI. Genes meet nodes.</p>
      </div>
    </Section>
  )
}

function How() {
  return (
    <Section id="how" className="py-20">
      <h2 className="text-center text-3xl font-bold md:text-4xl">How it works</h2>
      <p className="mx-auto mt-2 max-w-xl text-center text-white/60">From download to earning in four steps.</p>
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s) => (
          <div key={s.n} className="card relative p-6">
            <div className="flex items-center justify-between">
              <span className="font-chalk text-3xl text-white/30">{s.n}</span>
              <Pill color={s.live ? '#22d3ee' : '#818cf8'} label={s.tag} />
            </div>
            <h3 className="mt-3 text-lg font-semibold">{s.t}</h3>
            <p className="mt-2 text-sm text-white/60">{s.d}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}

function RunNode() {
  return (
    <Section id="run" className="py-20">
      <div className="mb-12 grid grid-cols-2 gap-5">
        <div className="card flex flex-col items-center p-4">
          <Model3D src="/models/node.glb" tint="#22d3ee" className="h-36 w-full" />
          <div className="mt-1 text-sm font-semibold text-white/90">Your node</div>
        </div>
        <div className="card flex flex-col items-center p-4">
          <Model3D src="/models/galaxy.glb" tint="#a78bfa" className="h-36 w-full" />
          <div className="mt-1 text-sm font-semibold text-white/90">The network</div>
        </div>
      </div>

      <div className="grid items-center gap-10 md:grid-cols-2">
        <div>
          <Pill color="#818cf8" label="App: coming soon" />
          <h2 className="mt-4 text-3xl font-bold md:text-4xl">A node anyone can run</h2>
          <p className="mt-4 text-white/70">
            One install, no command line, no config. It runs quietly in your tray and turns idle GPU time into rewards —
            the way Ollama made local AI a one-click thing.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-white/70">
            <li>🟢 Passive — earn points for GPU, storage + uptime.</li>
            <li>🔒 Torrent-like data layer — data is encrypted &amp; sharded; you never see raw data.</li>
            <li>🧬 Powers deep health &amp; DNA: genomics, folding, drug discovery, health Q&amp;A.</li>
            <li>🛡️ Wallet-bound identity — sybil-resistant, fair for everyone.</li>
          </ul>
          <div className="mt-7 flex flex-wrap gap-3">
            <span className="btn btn-ghost cursor-default px-5 py-2.5 opacity-70"> macOS — soon</span>
            <span className="btn btn-ghost cursor-default px-5 py-2.5 opacity-70"> Windows — soon</span>
            <span className="btn btn-ghost cursor-default px-5 py-2.5 opacity-70"> Linux — soon</span>
          </div>
        </div>

        {/* node status mock */}
        <div className="card p-5">
          <div className="mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
            <img src="/dna.svg" alt="" className="h-5 w-5" />
            <span className="text-sm font-semibold">Gennode Node</span>
            <span className="ml-auto inline-flex items-center gap-1.5 text-xs text-bluex">
              <span className="h-2 w-2 rounded-full bg-bluex" style={{ boxShadow: '0 0 8px #22d3ee' }} /> running
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-center text-sm">
            <div className="rounded-xl bg-white/5 p-3">
              <div className="font-chalk text-2xl text-bluex">12,480</div>
              <div className="text-xs text-white/50">points</div>
            </div>
            <div className="rounded-xl bg-white/5 p-3">
              <div className="font-chalk text-2xl text-bluex">99.8%</div>
              <div className="text-xs text-white/50">uptime</div>
            </div>
          </div>
          <div className="mt-3 space-y-2 text-sm text-white/70">
            <div className="flex justify-between">
              <span className="text-white/50">GPU</span>
              <span>RTX 4070 · detected</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">Wallet</span>
              <span>0x9a…3f2c</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">Network</span>
              <span>4,200 nodes online</span>
            </div>
          </div>
          <div className="mt-4 rounded-full bg-bluex/15 px-4 py-2 text-center text-sm text-bluex">Stop node</div>
        </div>
      </div>
    </Section>
  )
}

const flywheel = [
  { t: 'Real usage', s: 'compute & swaps' },
  { t: 'Trading fees', s: '1.2% per swap' },
  { t: 'Treasury · Rewards · Buyback', s: 'routed on-chain' },
  { t: 'More nodes → growth', s: 'network effect' },
]

function FeeFlywheel() {
  return (
    <div className="mt-14">
      <h3 className="text-center text-sm uppercase tracking-widest text-white/50">The self-funded flywheel</h3>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {flywheel.map((s, i) => (
          <div key={s.t} className="card relative p-5 text-center">
            <div className="font-chalk text-2xl text-bluex">{i + 1}</div>
            <div className="mt-1 text-sm font-semibold">{s.t}</div>
            <div className="text-xs text-white/55">{s.s}</div>
            {i < flywheel.length - 1 && (
              <div className="absolute -right-3 top-1/2 hidden -translate-y-1/2 text-lg text-bluex lg:block">→</div>
            )}
          </div>
        ))}
      </div>
      <p className="mt-4 text-center text-xs text-white/40">
        ↻ No pre-mine — the network pays for itself from real usage.
      </p>
    </div>
  )
}

function Token() {
  return (
    <Section id="token" className="py-20">
      <div className="grid items-start gap-10 md:grid-cols-2">
        <div>
          <h2 className="text-3xl font-bold md:text-4xl">
            <span className="font-chalk text-bluex">$GENNODE</span> — the fuel of the network
          </h2>
          <p className="mt-4 text-white/70">
            Launching on <strong className="text-white">Base</strong> via Bankr as a{' '}
            <strong className="text-white">100% fair launch</strong> — no team allocation, no pre-mine, no insider buy.
            Fixed supply of 100B, every token on the open market. Treasury and node rewards are funded entirely by
            trading fees.
          </p>
          <div className="mt-6 space-y-3">
            <div className="card p-4 text-sm">
              <span className="text-bluex">Run a node, earn.</span> Uptime + capacity earn points; points convert to
              $GENNODE in the airdrop.
            </div>
            <div className="card p-4 text-sm">
              <span className="text-bluex">Hold for more.</span> Fees buy back $GENNODE; holders/stakers get boosted
              rewards (soon).
            </div>
          </div>
          <p className="mt-6 text-xs text-white/40">
            $GENNODE is a utility token. Nothing here is financial advice or an offer of securities.
          </p>
        </div>

        <div className="card p-6">
          <h3 className="text-sm uppercase tracking-widest text-white/50">Supply</h3>
          <div className="mt-5 space-y-4">
            {supply.map((s) => (
              <div key={s.label}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-white/80">{s.label}</span>
                  <span className="text-white/50">{s.pct}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-white/8">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${s.pct}%`,
                      background: 'linear-gradient(90deg,#22d3ee,#818cf8)',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 text-center text-sm">
            <div className="rounded-xl bg-white/5 p-3">
              <div className="font-chalk text-2xl text-bluex">100B</div>
              <div className="text-xs text-white/50">fixed supply</div>
            </div>
            <div className="rounded-xl bg-white/5 p-3">
              <div className="font-chalk text-2xl text-bluex">Base</div>
              <div className="text-xs text-white/50">via Bankr</div>
            </div>
          </div>
        </div>
      </div>

      <FeeFlywheel />
    </Section>
  )
}

const stateStyle: Record<string, { ring: string; label: string; color: string }> = {
  now: { ring: 'border-bluex/50', label: 'Now', color: '#22d3ee' },
  next: { ring: 'border-indigox/40', label: 'Next', color: '#818cf8' },
  coming: { ring: 'border-white/10', label: 'Coming', color: '#6b7280' },
}

function Roadmap() {
  return (
    <Section id="roadmap" className="py-20">
      <h2 className="text-center text-3xl font-bold md:text-4xl">Roadmap</h2>
      <p className="mt-2 text-center text-white/60">Node network first, real bio-compute next.</p>
      <div className="mt-12 grid gap-4 md:grid-cols-5">
        {roadmap.map((r) => {
          const st = stateStyle[r.state]
          return (
            <div key={r.p} className={`card border ${st.ring} p-5`}>
              <Pill color={st.color} label={st.label} />
              <div className="mt-3 text-xs uppercase tracking-widest text-white/40">{r.p}</div>
              <h3 className="mt-1 font-semibold">{r.t}</h3>
              <p className="mt-2 text-xs text-white/55">{r.d}</p>
            </div>
          )
        })}
      </div>
    </Section>
  )
}

const showcase = [
  { src: '/models/protein.glb', label: 'Protein folding', tint: '#38bdf8' },
  { src: '/models/cell.glb', label: 'Cells & genomics', tint: '#5eead4' },
  { src: '/models/cluster.glb', label: 'Molecule discovery', tint: '#38bdf8' },
  { src: '/models/capsule.glb', label: 'Drug discovery', tint: '#22d3ee' },
  { src: '/models/atom.glb', label: 'AI inference', tint: '#38bdf8' },
  { src: '/models/dna.glb', label: 'DNA & genomics', tint: '#22d3ee' },
  { src: '/models/node.glb', label: 'Your node', tint: '#818cf8' },
  { src: '/models/galaxy.glb', label: 'The network', tint: '#a78bfa' },
]

function Showcase() {
  return (
    <Section id="science" className="py-20">
      <h2 className="text-center text-3xl font-bold md:text-4xl">What the network computes</h2>
      <p className="mx-auto mt-2 max-w-xl text-center text-white/60">
        Built for one vertical: bio. The workloads your nodes will power.
      </p>
      <div className="mt-12 grid grid-cols-2 gap-5 md:grid-cols-3">
        {showcase.map((m) => (
          <div key={m.label} className="card flex flex-col items-center p-4">
            <Model3D src={m.src} tint={m.tint} className="h-40 w-full" />
            <div className="mt-1 text-sm font-semibold text-white/90">{m.label}</div>
          </div>
        ))}
      </div>
    </Section>
  )
}

function Waitlist() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.includes('@')) return
    // TODO: wire to coordinator/API. For now we just acknowledge locally.
    setDone(true)
  }

  return (
    <Section id="waitlist" className="py-20">
      <div className="rounded-3xl border border-bluex/20 bg-gradient-to-b from-bluex/10 to-transparent p-10 text-center">
        <h2 className="text-3xl font-bold md:text-4xl">Be an early node</h2>
        <p className="mx-auto mt-3 max-w-xl text-white/65">
          Get notified the moment the node app drops, and start earning points toward the $GENNODE airdrop.
        </p>

        {done ? (
          <p className="mt-8 font-chalk text-3xl text-bluex glow-text">You're on the list. See you soon ✦</p>
        ) : (
          <form onSubmit={submit} className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="flex-1 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm outline-none placeholder:text-white/30 focus:border-bluex"
            />
            <button type="submit" className="btn btn-primary px-6 py-3">
              Notify me
            </button>
          </form>
        )}
      </div>
    </Section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-white/5 py-12">
      <Section>
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <img
              src="/logo.png"
              onError={(e) => {
                e.currentTarget.src = '/dna.svg'
              }}
              alt="Gennode"
              className="h-8 w-8 rounded-sm"
            />
            <span className="font-bold tracking-wide">GENNODE</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-white/60">
            <a href="#run" className="transition hover:text-white">
              Run a node
            </a>
            <a href={DOCS_URL} className="transition hover:text-white">
              Docs
            </a>
            <a href="#token" className="transition hover:text-white">
              Token
            </a>
            <a href={X_URL} target="_blank" rel="noreferrer" className="transition hover:text-white">
              X / Twitter
            </a>
          </div>
        </div>

        <div className="mt-8 space-y-2 text-center text-xs leading-relaxed text-white/35 md:text-left">
          <p>
            <strong className="text-white/50">Early access.</strong> Gennode is a decentralized bio-compute network in
            active development. The node app and $GENNODE token are not yet released; features, rewards and timelines may
            change.
          </p>
          <p>
            $GENNODE is a utility token intended for use within the network. Nothing on this site is financial, investment
            or legal advice, nor an offer or solicitation to buy any asset. Crypto is volatile and risky.
          </p>
          <p className="pt-2 text-white/30">© {new Date().getFullYear()} Gennode. Genes meet nodes.</p>
        </div>
      </Section>
    </footer>
  )
}

export default function App() {
  const [introDone, setIntroDone] = useState(false)
  return (
    <div className="bg-board relative min-h-screen">
      {!introDone && <Intro onDone={() => setIntroDone(true)} />}
      <MotifDNA className="pointer-events-none fixed left-3 top-28 z-0 hidden h-44 w-16 text-bluex/15 lg:block" />
      <MotifMolecule className="pointer-events-none fixed bottom-8 right-5 z-0 hidden h-28 w-28 text-indigox/15 lg:block" />
      <Nav />
      <main className="relative z-10">
        <Hero />
        <Reveal>
          <Problem />
        </Reveal>
        <Reveal>
          <How />
        </Reveal>
        <Reveal>
          <RunNode />
        </Reveal>
        <Reveal>
          <Showcase />
        </Reveal>
        <Reveal>
          <Token />
        </Reveal>
        <Reveal>
          <Roadmap />
        </Reveal>
        <Reveal>
          <Waitlist />
        </Reveal>
      </main>
      <Footer />
    </div>
  )
}
