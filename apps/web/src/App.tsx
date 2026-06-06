import { useEffect, useRef, useState } from 'react'
import DNA from './components/DNA'
import Model3D from './components/Model3D'
import Intro from './components/Intro'

const X_URL = 'https://x.com/gennode'

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
  { t: 'Your privacy is gone', d: 'Big tech logs and profiles your most personal questions — your health included.' },
  { t: 'Care is gatekept', d: 'The bio-AI that could help — drug discovery, genomics — runs on expensive, centralized compute.' },
  { t: 'Generic AI isn’t enough', d: 'One-size chatbots aren’t built for health, and most GPU networks aren’t built for bio.' },
]

const steps = [
  {
    n: '01',
    t: 'Ask privately',
    d: 'Type your health question. No profiling, no logging — your questions stay yours.',
    tag: 'Live · beta',
    live: true,
  },
  {
    n: '02',
    t: 'Grounded answers',
    d: 'Sourced, guard-railed responses that help you understand — never a diagnosis.',
    tag: 'Live · beta',
    live: true,
  },
  {
    n: '03',
    t: 'Community nodes',
    d: 'People run GPU nodes; the AI runs on a decentralized network handling DNA & protein compute.',
    tag: 'Coming',
    live: false,
  },
]

const roadmap = [
  { p: 'Phase 1', t: 'Health AI beta', d: 'Private, Venice-powered health assistant + this site.', state: 'now' },
  { p: 'Phase 2', t: 'Community & points', d: 'Grow users, doctor mode, earn participation points.', state: 'next' },
  { p: 'Phase 3', t: 'Token launch', d: '$GENNODE on Base via Bankr. Airdrop to early supporters.', state: 'next' },
  { p: 'Phase 4', t: 'Node network', d: 'Run a node, decentralized inference, compute rewards.', state: 'coming' },
  { p: 'Phase 5', t: 'Bio-compute', d: 'DNA, protein folding & genomics jobs on the network.', state: 'coming' },
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
    ['Health AI', '#health'],
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
        <a href="#waitlist" className="btn btn-primary px-4 py-2 text-sm">
          Join the Airdrop
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
            <Pill color="#22d3ee" label="AI: Live (beta)" />
            <Pill color="#818cf8" label="Node network: Coming" />
          </div>

          <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">
            Your health questions,
            <br />
            <span className="font-chalk text-6xl text-bluex glow-text md:text-7xl">kept private.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg text-white/70">
            A private, judgment-free health AI built for one vertical: <strong className="text-white">bio</strong>. Ask
            freely — your questions are never logged or sold. Powered today by Venice; tomorrow by a decentralized
            network of community GPU nodes.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <a href="#health" className="btn btn-primary px-6 py-3">
              Try Health AI (beta)
            </a>
            <a href="#waitlist" className="btn btn-ghost px-6 py-3">
              Join the Airdrop →
            </a>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/55">
            <span>🔒 No logs</span>
            <span>📚 Sourced answers</span>
            <span>🩺 Doctor mode</span>
            <span>⛓ Built on Base</span>
          </div>

          <p className="mt-5 text-xs text-white/40">
            Information & wellness only — not medical advice. Beta software.
          </p>
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
        <p className="mt-1 text-white/60">
          Private health AI today — a community bio-compute network tomorrow. Genes meet nodes.
        </p>
      </div>
    </Section>
  )
}

function How() {
  return (
    <Section id="how" className="py-20">
      <h2 className="text-center text-3xl font-bold md:text-4xl">How it works</h2>
      <div className="mt-12 grid gap-5 md:grid-cols-3">
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

function HealthDemo() {
  return (
    <Section id="health" className="py-20">
      <div className="mb-12 grid grid-cols-2 gap-5">
        <div className="card flex flex-col items-center p-4">
          <Model3D src="/models/brain.glb" tint="#22d3ee" className="h-36 w-full" />
          <div className="mt-1 text-sm font-semibold text-white/90">Neural intelligence</div>
        </div>
        <div className="card flex flex-col items-center p-4">
          <Model3D src="/models/shield.glb" tint="#5eead4" className="h-36 w-full" />
          <div className="mt-1 text-sm font-semibold text-white/90">Private by design</div>
        </div>
      </div>
      <div className="grid items-center gap-10 md:grid-cols-2">
        <div>
          <Pill color="#22d3ee" label="Live · beta" />
          <h2 className="mt-4 text-3xl font-bold md:text-4xl">A health assistant that respects you</h2>
          <p className="mt-4 text-white/70">
            Gennode helps you understand symptoms, lab results and what to ask your doctor — in plain language, with
            sources. It never diagnoses, and it always points you to a professional when it matters.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-white/70">
            <li>🔒 Private by design — no logging, no profiling.</li>
            <li>📚 Grounded answers with sources, not guesses.</li>
            <li>🩺 Doctor mode — explain conditions to patients faster.</li>
            <li>⚠️ Safe triage — flags red-flag symptoms to seek care.</li>
          </ul>
          <p className="mt-6 text-xs text-white/40">
            Not a medical device. For information only — the final decision and responsibility rest with you and your
            clinician.
          </p>
        </div>

        {/* mock chat */}
        <div className="card p-5">
          <div className="mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
            <img src="/dna.svg" alt="" className="h-5 w-5" />
            <span className="text-sm font-semibold">Gennode Health AI</span>
            <span className="ml-auto text-xs text-white/40">beta</span>
          </div>
          <div className="space-y-3 text-sm">
            <div className="ml-auto max-w-[80%] rounded-2xl rounded-tr-sm bg-bluex/15 px-4 py-2 text-white/90">
              I've had a mild headache and low fever for 2 days. Should I worry?
            </div>
            <div className="max-w-[88%] rounded-2xl rounded-tl-sm bg-white/5 px-4 py-3 text-white/80">
              <p>
                I'm not a doctor, but here's general info. A mild headache with low-grade fever for a couple of days is
                often viral and tends to settle with rest and fluids.
              </p>
              <p className="mt-2 text-white/70">
                <strong className="text-white">Seek care</strong> if you notice: a stiff neck, a rash that doesn't fade,
                confusion, a fever above 39.5°C, or symptoms lasting beyond a few days.
              </p>
              <p className="mt-2 text-xs text-white/40">This isn't a diagnosis. Please consult a clinician.</p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/40">
            Ask a health question…
            <span className="ml-auto rounded-full bg-bluex/20 px-3 py-1 text-xs text-bluex">soon</span>
          </div>
        </div>
      </div>
    </Section>
  )
}

const flywheel = [
  { t: 'Real usage', s: 'queries & swaps' },
  { t: 'Trading fees', s: '1.2% per swap' },
  { t: 'Treasury · Rewards · Buyback', s: 'routed on-chain' },
  { t: 'Buy pressure → growth', s: 'more users' },
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
            Fixed supply of 100B, every token on the open market. Treasury and rewards are funded entirely by trading
            fees.
          </p>
          <div className="mt-6 space-y-3">
            <div className="card p-4 text-sm">
              <span className="text-bluex">Revenue → rewards.</span> Swap fees + premium revenue fund buybacks, the
              community airdrop and (soon) node-operator pay.
            </div>
            <div className="card p-4 text-sm">
              <span className="text-bluex">Earn by contributing.</span> Today: early use, referrals, feedback. Tomorrow:
              real compute on your GPU.
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
      <p className="mt-2 text-center text-white/60">Progressive decentralization — working product first, network next.</p>
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
  { src: '/models/cluster.glb', label: 'Molecule cluster', tint: '#38bdf8' },
  { src: '/models/capsule.glb', label: 'Drug discovery', tint: '#22d3ee' },
  { src: '/models/heart.glb', label: 'Health', tint: '#818cf8' },
  { src: '/models/atom.glb', label: 'Science', tint: '#38bdf8' },
  { src: '/models/node.glb', label: 'Compute node', tint: '#818cf8' },
  { src: '/models/galaxy.glb', label: 'Decentralized network', tint: '#a78bfa' },
]

function Showcase() {
  return (
    <Section id="science" className="py-20">
      <h2 className="text-center text-3xl font-bold md:text-4xl">Built for bio</h2>
      <p className="mx-auto mt-2 max-w-xl text-center text-white/60">
        The biology and infrastructure Gennode is made of — and what the network will compute.
      </p>
      <div className="mt-12 grid grid-cols-2 gap-5 md:grid-cols-3">
        {showcase.map((m) => (
          <div key={m.src} className="card flex flex-col items-center p-4">
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
        <h2 className="text-3xl font-bold md:text-4xl">Get early access + airdrop</h2>
        <p className="mx-auto mt-3 max-w-xl text-white/65">
          Be first to try the private health AI and earn participation points toward the $GENNODE airdrop.
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
              Join
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
            <a href="#health" className="transition hover:text-white">
              Health AI
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
            <strong className="text-white/50">Beta software.</strong> Gennode provides general health information and
            wellness support only. It is not a medical device and does not diagnose, treat or prescribe. Always consult
            a qualified clinician; the final decision and responsibility rest with you and your doctor. In an emergency,
            contact local emergency services.
          </p>
          <p>
            $GENNODE is a utility token intended for use within the network. Nothing on this site is financial, investment
            or legal advice, nor an offer or solicitation to buy any asset.
          </p>
          <p className="pt-2 text-white/30">© {new Date().getFullYear()} Gennode. All rights reserved.</p>
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
          <Showcase />
        </Reveal>
        <Reveal>
          <HealthDemo />
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
