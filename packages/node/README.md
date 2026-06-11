# @gennode/node — run a Gennode node

[![npm](https://img.shields.io/npm/v/%40gennode%2Fnode)](https://www.npmjs.com/package/@gennode/node) [![license](https://img.shields.io/badge/license-MIT-blue)](https://github.com/Gen-Node/Gen-Node/blob/main/LICENSE) [![node](https://img.shields.io/node/v/%40gennode%2Fnode)](https://nodejs.org)

Contribute idle compute to **Gennode**, a private, torrent-like decentralized compute network for heavy bio & health computation — DNA & genome analysis, protein folding, drug discovery, disease research, and genomics — and earn points toward the planned **$GENNODE** airdrop. Cross-platform: **macOS · Windows · Linux**.

> Beta. Gennode is a private, torrent-like decentralized compute network for bio & DNA. **$GENNODE has not launched yet** — it is planned as a 100% fair launch on Base via Bankr (0 team, 0 pre-mine). Nothing here is financial advice.

## Requirements
- **Node.js 18+** — macOS: `brew install node` · Windows: [nodejs.org](https://nodejs.org) · Linux: your package manager or [nodejs.org](https://nodejs.org)

## Quick start — run a node
```bash
npx @gennode/node                          # register this machine + start earning
npx @gennode/node --wallet 0xYOUR_WALLET   # same, with your payout wallet linked up front
```
1. `npx @gennode/node` detects your hardware, runs a short CPU benchmark, registers the node with the coordinator, and starts sending heartbeats.
2. Link the payout wallet: pass `--wallet 0xYOUR_WALLET` as above, run `gennode wallet 0xYOUR_WALLET` (the `gennode` command is on your PATH after `npm i -g @gennode/node`), or link it later at [app.gennode.org](https://app.gennode.org).
3. Leave it running. You **earn points for uptime × capacity** — capacity is derived from your CPU cores, RAM, and benchmark. Press Ctrl+C to stop; your points are saved and resume next run.

Install globally instead: `npm i -g @gennode/node`, then run `gennode`.

### Prefer a desktop app?
A desktop node app (Tauri; macOS/Windows/Linux) is **available in early access** — download the installer for your platform (Windows `.exe`/`.msi` · macOS `.dmg` for Apple Silicon & Intel · Linux `.AppImage`/`.deb`/`.rpm`) from the [Releases page](https://github.com/Gen-Node/Gen-Node/releases/latest). Builds are unsigned during early access, so Windows SmartScreen / macOS Gatekeeper will ask for a click-through — the [run-a-node docs](https://docs.gennode.org/run-a-node) walk through it. The CLI here does the same job headlessly.

## Commands
| Command | What it does |
| --- | --- |
| `npx @gennode/node` | Register this machine and run a node (the default — this is the product) |
| `gennode node` | Same as above: start / resume the node |
| `gennode node status` | Show this node's points, uptime, rank, and capacity |
| `gennode wallet <address>` | Link the payout wallet to your node |
| `gennode help` | Show CLI help |

### Options when starting a node
| Flag | Meaning |
| --- | --- |
| `--wallet <address>` | Set the payout wallet when starting the node |

By default the node talks to the coordinator at `https://app.gennode.org`. Override with the `GENNODE_COORDINATOR` environment variable if you are self-hosting.

## How points work (v1 — honest scope)
- **Today:** points accrue from **uptime** and a **capacity** score. On registration the node runs a small SHA-256 **CPU benchmark** — this proves real hardware (basic anti-sybil), it is **not** a GPU proof-of-work. Anti-sybil today is wallet linking, that benchmark, and a device fingerprint enforcing **one device = one node**; cluster analysis and deeper dedup heuristics are **planned**.
- **Roadmap:** running real compute jobs (DNA & genome analysis, protein folding, drug discovery, disease research, genomics, multi-omics), the encrypted torrent-like **data layer**, and advanced anti-sybil. These are **not** active yet and are not required to earn today.
- **$GENNODE** has not launched. Points are planned to convert to $GENNODE in an airdrop once the token goes live as a 100% fair launch on Base.

## What gets sent where
Node telemetry only. When you run a node, the CLI sends to the Gennode coordinator:
- your **hardware specs** (CPU/RAM/GPU model, OS/arch),
- your **CPU benchmark score**,
- a one-way **SHA-256 fingerprint** of your machine, derived from hostname + OS username + hardware — used for the one-device-one-node anti-sybil rule; the raw values never leave your machine,
- your **linked wallet address** (if you set one),
- periodic **heartbeats** so it can award points.

It does not read your files or run third-party code today.

## Local development (from this repo, before npm publish)
```bash
node packages/node/src/index.mjs            # run a node
node packages/node/src/index.mjs node status
```

The node engine is in [`src/node.mjs`](./src/node.mjs).

## Links
[gennode.org](https://gennode.org) · [docs.gennode.org](https://docs.gennode.org) · [app.gennode.org](https://app.gennode.org) · [GitHub](https://github.com/Gen-Node/Gen-Node) · [Releases](https://github.com/Gen-Node/Gen-Node/releases) · [npm](https://www.npmjs.com/package/@gennode/node) · [X](https://x.com/gennode)
