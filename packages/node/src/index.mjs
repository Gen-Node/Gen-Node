#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import readline from 'node:readline'
import { spawn } from 'node:child_process'
import { GENNODE_SYSTEM_PROMPT } from './prompt.mjs'
import { runNode, nodeStatus, linkWallet } from './node.mjs'

const CONFIG_DIR = path.join(os.homedir(), '.gennode')
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json')
const VENICE_URL = 'https://api.venice.ai/api/v1/chat/completions'
const OLLAMA_URL = 'http://localhost:11434/api/chat'
const DEFAULT_GATEWAY = (process.env.GENNODE_GATEWAY || 'http://localhost:8787').replace(/\/+$/, '')

const DISCLAIMER =
  'Gennode is a decentralized bio & AI compute network. $GENNODE is a utility token — nothing here is financial advice.'

function loadConfig() {
  try {
    return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'))
  } catch {
    return {}
  }
}

function saveConfig(cfg) {
  fs.mkdirSync(CONFIG_DIR, { recursive: true })
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(cfg, null, 2))
}

function prompt(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  return new Promise((resolve) => rl.question(question, (a) => (rl.close(), resolve(a.trim()))))
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

function openBrowser(url) {
  try {
    if (process.platform === 'win32') spawn('cmd', ['/c', 'start', '', url], { stdio: 'ignore', detached: true }).unref()
    else if (process.platform === 'darwin') spawn('open', [url], { stdio: 'ignore', detached: true }).unref()
    else spawn('xdg-open', [url], { stdio: 'ignore', detached: true }).unref()
  } catch {
    /* user opens it manually */
  }
}

async function callVenice(messages, { apiKey, model }) {
  const res = await fetch(VENICE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model, messages, temperature: 0.4 }),
  })
  if (!res.ok) throw new Error(`Venice API ${res.status}: ${(await res.text()).slice(0, 300)}`)
  const data = await res.json()
  return data.choices?.[0]?.message?.content?.trim() ?? '(no response)'
}

async function callOllama(messages, { model }) {
  let res
  try {
    res = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, messages, stream: false }),
    })
  } catch {
    throw new Error("Can't reach Ollama at localhost:11434. Install it (ollama.com) and run 'ollama serve'.")
  }
  if (!res.ok) throw new Error(`Ollama ${res.status}: ${(await res.text()).slice(0, 300)}`)
  const data = await res.json()
  return data.message?.content?.trim() ?? '(no response)'
}

async function callGateway(messages, { url, key, model, tier, provider }) {
  const res = await fetch(url + '/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({ messages, model, tier, provider }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(`Gateway ${res.status}: ${data.error || JSON.stringify(data).slice(0, 200)}`)
  return (data.content ?? '(no response)').trim()
}

function parseArgs(argv) {
  const out = { _: [], flags: {} }
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i]
    if (a.startsWith('--')) {
      const key = a.slice(2)
      const next = argv[i + 1]
      if (next && !next.startsWith('--')) {
        out.flags[key] = next
        i++
      } else out.flags[key] = true
    } else out._.push(a)
  }
  return out
}

function resolveBackend(args) {
  const cfg = loadConfig()
  if (args.flags.ollama || (cfg.backend === 'ollama' && !args.flags.venice && !args.flags.key)) {
    return { kind: 'ollama', model: args.flags.model || cfg.ollamaModel || 'llama3.2' }
  }
  // gateway (credits) — used by default once connected, unless --venice/--key forces direct
  if (!args.flags.venice && !args.flags.key && cfg.gatewayUrl && cfg.gatewayKey) {
    return {
      kind: 'gateway',
      url: cfg.gatewayUrl.replace(/\/+$/, ''),
      key: cfg.gatewayKey,
      model: args.flags.model || cfg.model,
      tier: args.flags.cheap ? 'cheap' : args.flags.private ? 'private' : undefined,
      provider: typeof args.flags.provider === 'string' ? args.flags.provider : undefined,
    }
  }
  const apiKey = args.flags.key || process.env.VENICE_API_KEY || cfg.veniceApiKey
  if (!apiKey) {
    throw new Error("No backend. Run 'gennode login' (Venice), 'gennode connect <url> <key>' (gateway), or use --ollama.")
  }
  return { kind: 'venice', apiKey, model: args.flags.model || cfg.model || 'llama-3.3-70b' }
}

async function answer(messages, backend) {
  if (backend.kind === 'ollama') return callOllama(messages, backend)
  if (backend.kind === 'gateway') return callGateway(messages, backend)
  return callVenice(messages, backend)
}

const HELP = `
🧬 Gennode — run a node for the bio & AI compute network (macOS · Windows · Linux)

Usage:
  npx @gennode/node             Start a node (register + earn points)   ← main
  gennode node                  Start a node
  gennode node status           Show your node's points, uptime & rank
  gennode wallet 0x…            Link a payout wallet to your node
  gennode chat                  Chat with the Gennode bio & AI assistant
  gennode ask "question"        One-shot question to the assistant
  gennode setup                 Choose an assistant backend (cloud credits / local Ollama / Venice key)
  gennode help                  Show this help

Run a node:
  1) npx @gennode/node
  2) gennode wallet 0x…         (link your rewards wallet)
  3) leave it running — you earn points for uptime + capacity

Options:
  --wallet 0x…                  Set the payout wallet when starting a node
  --ollama / --cheap / --private / --model <m> / --key <k>   (assistant backends)

Your node contributes idle compute to a decentralized network for bio & AI.
${DISCLAIMER}
`

async function setupCloud(args) {
  const cfg = loadConfig()
  const gateway = ((args.flags.gateway && String(args.flags.gateway)) || cfg.gatewayUrl || DEFAULT_GATEWAY).replace(/\/+$/, '')
  let start
  try {
    start = await (await fetch(gateway + '/v1/device/start', { method: 'POST' })).json()
  } catch {
    return console.error(`Can't reach gateway at ${gateway}. Is it running? (set GENNODE_GATEWAY or pass --gateway <url>)`)
  }
  console.log('\nOpening your dashboard to get free credits…')
  console.log('If it does not open, visit:\n  ' + start.verifyUrl + '\n')
  openBrowser(start.verifyUrl)
  process.stdout.write('Waiting for approval')
  for (let i = 0; i < 150; i++) {
    await sleep(2000)
    process.stdout.write('.')
    try {
      const p = await (await fetch(gateway + '/v1/device/poll?code=' + start.code)).json()
      if (p.apiKey) {
        const c = loadConfig()
        c.gatewayUrl = gateway
        c.gatewayKey = p.apiKey
        c.backend = 'gateway'
        saveConfig(c)
        let me = {}
        try {
          me = await (await fetch(gateway + '/v1/me', { headers: { Authorization: 'Bearer ' + p.apiKey } })).json()
        } catch {}
        console.log('\n')
        if (me.wallet) console.log('✓ Wallet connected: ' + me.wallet.slice(0, 6) + '…' + me.wallet.slice(-4))
        console.log('✓ Linked! Credits: ' + (me.credits ?? '—') + ' — run "gennode" to chat.')
        return
      }
    } catch {
      /* keep polling */
    }
  }
  console.log('\nTimed out. Run "gennode setup" again.')
}

async function setupLocal() {
  console.log('\nLocal mode runs an AI model on your machine via Ollama — free and fully private.')
  const ok = await fetch('http://localhost:11434/api/tags').then((r) => r.ok).catch(() => false)
  if (!ok) {
    console.log('  • Install Ollama:  https://ollama.com')
    console.log('  • Pull a model:    ollama pull llama3.2')
    console.log('  • (HuggingFace GGUF models work too:  ollama run hf.co/<user>/<model>)')
  } else {
    console.log('  ✓ Ollama detected. Make sure a model is pulled:  ollama pull llama3.2')
  }
  const c = loadConfig()
  c.backend = 'ollama'
  c.ollamaModel = c.ollamaModel || 'llama3.2'
  saveConfig(c)
  console.log('\n✓ Local mode set. Run "gennode" to chat — offline, on your machine.')
}

async function setupVenice() {
  const key = await prompt('Paste your Venice API key (https://venice.ai): ')
  if (!key) return console.log('No key entered.')
  const c = loadConfig()
  c.veniceApiKey = key
  c.backend = 'venice'
  saveConfig(c)
  console.log('✓ Venice key saved. Run "gennode" to chat.')
}

async function setup(args) {
  console.log('\n🧬 Gennode setup — private AI in your terminal\n')
  console.log('  1) Cloud credits  — free credits via the dashboard (easiest)')
  console.log('  2) Local model    — fully private, on your machine (Ollama / HuggingFace)')
  console.log('  3) Venice key     — bring your own Venice API key\n')
  const choice = await prompt('Choose 1 / 2 / 3: ')
  if (choice === '2') return setupLocal()
  if (choice === '3') return setupVenice()
  return setupCloud(args)
}

async function main() {
  const args = parseArgs(process.argv)
  const cmd = args._[0]

  if (cmd === 'help' || args.flags.help) {
    console.log(HELP)
    return
  }

  if (cmd === 'setup') return setup(args)

  if (cmd === 'node') {
    const cfg = loadConfig()
    if (args._[1] === 'status') return nodeStatus(cfg)
    if (typeof args.flags.wallet === 'string') {
      cfg.wallet = String(args.flags.wallet).toLowerCase()
      saveConfig(cfg)
    }
    return runNode(cfg, saveConfig)
  }

  if (cmd === 'wallet') {
    const cfg = loadConfig()
    return linkWallet(cfg, saveConfig, args._[1])
  }

  if (cmd === 'connect') {
    const url = args._[1]
    const gkey = args._[2]
    if (!url || !gkey) return console.log('Usage: gennode connect <gateway-url> <gk_key>')
    const cfg = loadConfig()
    cfg.gatewayUrl = url
    cfg.gatewayKey = gkey
    saveConfig(cfg)
    return console.log(`✓ Connected to ${url} (credits mode). Run 'gennode' to chat.`)
  }

  if (cmd === 'login') {
    const key = await prompt('Paste your Venice API key: ')
    if (!key) return console.log('No key entered.')
    const cfg = loadConfig()
    cfg.veniceApiKey = key
    saveConfig(cfg)
    return console.log(`✓ Saved to ${CONFIG_FILE}`)
  }

  if (cmd === 'ask') {
    const q = args._.slice(1).join(' ')
    if (!q) return console.log('Usage: gennode ask "your question"')
    try {
      const backend = resolveBackend(args)
      const reply = await answer(
        [
          { role: 'system', content: GENNODE_SYSTEM_PROMPT },
          { role: 'user', content: q },
        ],
        backend,
      )
      console.log('\n' + reply + '\n')
    } catch (e) {
      console.error('Error:', e.message)
      process.exitCode = 1
    }
    return
  }

  if (cmd === 'chat') return interactiveChat(args)

  // default (no command): run a node — this is the product
  const cfg = loadConfig()
  if (typeof args.flags.wallet === 'string' && /^0x[0-9a-fA-F]{40}$/.test(args.flags.wallet)) {
    cfg.wallet = String(args.flags.wallet).toLowerCase()
    saveConfig(cfg)
  }
  return runNode(cfg, saveConfig)
}

async function interactiveChat(args) {
  {
    const c = loadConfig()
    if (!c.gatewayKey && !c.veniceApiKey && !c.backend && !args.flags.ollama && !args.flags.key) {
      console.log('No assistant backend yet — connecting one.')
      return setup(args)
    }
  }
  let backend
  try {
    backend = resolveBackend(args)
  } catch (e) {
    console.error('Error:', e.message)
    process.exitCode = 1
    return
  }

  console.log('\n🧬 Gennode — bio & AI assistant (beta)')
  console.log(`   backend: ${backend.kind} (${backend.model}) · type "exit" to quit`)
  console.log(`   ${DISCLAIMER}\n`)

  const history = [{ role: 'system', content: GENNODE_SYSTEM_PROMPT }]
  for (;;) {
    const q = await prompt('you › ')
    if (!q) continue
    if (['exit', 'quit', ':q'].includes(q.toLowerCase())) {
      console.log('Take care 🧬')
      break
    }
    history.push({ role: 'user', content: q })
    try {
      const reply = await answer(history, backend)
      history.push({ role: 'assistant', content: reply })
      console.log('\ngennode › ' + reply + '\n')
    } catch (e) {
      console.error('Error:', e.message, '\n')
      history.pop()
    }
  }
}

main()
