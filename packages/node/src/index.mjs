#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { createRequire } from 'node:module'
import { runNode, nodeStatus, linkWallet } from './node.mjs'

const pkg = createRequire(import.meta.url)('../package.json')

const CONFIG_DIR = path.join(os.homedir(), '.gennode')
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json')

const DISCLAIMER =
  'Gennode is a private, decentralized network for bio & DNA compute. $GENNODE is not launched yet — nothing here is financial advice.'

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

const HELP = `
🧬 Gennode — run a node for the private bio & DNA compute network (macOS · Windows · Linux)

Usage:
  npx @gennode/node             Start a node (register + earn points) — the default
  gennode node                  Start a node
  gennode node status           Show your node's points, uptime & rank
  gennode wallet <address>      Link a payout wallet to your node
  gennode help                  Show this help

Run a node:
  1) npx @gennode/node
  2) gennode wallet 0xYOUR_WALLET   (or link it at app.gennode.org)
  3) leave it running — you earn points for uptime × capacity

Options:
  --wallet <address>            Set the payout wallet when starting the node
  --version                     Print the CLI version

Your idle machine contributes compute to a private, decentralized network for
DNA & genome analysis, protein folding, drug discovery and health research.
${DISCLAIMER}
`

function startNode(args) {
  const cfg = loadConfig()
  if (typeof args.flags.wallet === 'string') {
    cfg.wallet = String(args.flags.wallet).toLowerCase()
    saveConfig(cfg)
  }
  return runNode(cfg, saveConfig)
}

async function main() {
  const args = parseArgs(process.argv)
  const cmd = args._[0]

  if (args.flags.version || cmd === '-v' || cmd === '-V') return console.log(pkg.version)

  if (cmd === 'help' || cmd === '-h' || args.flags.help) return console.log(HELP)

  if (cmd === 'wallet') {
    const cfg = loadConfig()
    return linkWallet(cfg, saveConfig, args._[1])
  }

  if (cmd === 'node') {
    if (args._[1] === 'status') return nodeStatus(loadConfig())
    return startNode(args)
  }

  if (cmd !== undefined) {
    console.error(`Unknown command: ${cmd}`)
    console.error(HELP)
    process.exitCode = 1
    return
  }

  // default (no command): run a node — this is the product
  return startNode(args)
}

main()
