#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import readline from 'node:readline'
import { GENNODE_SYSTEM_PROMPT } from './prompt.mjs'

const CONFIG_DIR = path.join(os.homedir(), '.gennode')
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json')
const VENICE_URL = 'https://api.venice.ai/api/v1/chat/completions'
const OLLAMA_URL = 'http://localhost:11434/api/chat'

const DISCLAIMER =
  'Gennode provides health information & wellness support only — not a medical device, not a diagnosis. Always consult a clinician.'

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
  if (args.flags.ollama) {
    return { kind: 'ollama', model: args.flags.model || cfg.ollamaModel || 'llama3.2' }
  }
  const apiKey = args.flags.key || process.env.VENICE_API_KEY || cfg.veniceApiKey
  if (!apiKey) {
    throw new Error("No Venice API key. Run 'gennode login', set VENICE_API_KEY, or use --ollama.")
  }
  return { kind: 'venice', apiKey, model: args.flags.model || cfg.model || 'llama-3.3-70b' }
}

async function answer(messages, backend) {
  return backend.kind === 'ollama' ? callOllama(messages, backend) : callVenice(messages, backend)
}

const HELP = `
🧬 Gennode — private health AI, run locally (macOS & Windows)

Usage:
  gennode                       Start an interactive chat
  gennode ask "your question"   One-shot question
  gennode login                 Save your Venice API key
  gennode help                  Show this help

Options:
  --ollama                      Use a local Ollama model (fully offline) instead of Venice
  --model <name>                Model (default: Venice 'llama-3.3-70b' / Ollama 'llama3.2')
  --key <key>                   Venice API key (overrides saved key / env)

Setup:
  1) Get a Venice API key: https://venice.ai
  2) gennode login   (or set the VENICE_API_KEY environment variable)
  3) gennode

Privacy: your questions go only to the backend you choose. Gennode logs nothing.
${DISCLAIMER}
`

async function main() {
  const args = parseArgs(process.argv)
  const cmd = args._[0]

  if (cmd === 'help' || args.flags.help) {
    console.log(HELP)
    return
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

  // interactive chat
  let backend
  try {
    backend = resolveBackend(args)
  } catch (e) {
    console.error('Error:', e.message)
    process.exitCode = 1
    return
  }

  console.log('\n🧬 Gennode — private health AI (beta)')
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
