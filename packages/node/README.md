# @gennode/node — run a Gennode node

Contribute idle compute to **Gennode**, a decentralized compute + data network for bio & AI, and earn points toward the planned **$GENNODE** airdrop. Cross-platform: **macOS · Windows · Linux**. The package also ships an optional **bio & AI assistant** (see below).

> Beta. Gennode is a decentralized compute + data network for bio & AI. **$GENNODE has not launched yet** — it is planned as a 100% fair launch on Base via Bankr (0 team, 0 pre-mine). Nothing here is financial advice.

## Requirements
- **Node.js 18+** — macOS: `brew install node` · Windows: [nodejs.org](https://nodejs.org) · Linux: your package manager or [nodejs.org](https://nodejs.org)

## Quick start — run a node
```bash
npx @gennode/node            # register this machine + start earning
gennode wallet 0x…           # link the wallet that will receive rewards
```
1. `npx @gennode/node` detects your hardware, runs a short CPU benchmark, registers the node with the coordinator, and starts sending heartbeats.
2. `gennode wallet 0x…` links the payout wallet to your node (you can also set it up front with `--wallet 0x…`, or link it later at [app.gennode.org](https://app.gennode.org)).
3. Leave it running. You **earn points for uptime × capacity** — capacity is derived from your CPU cores, RAM, and benchmark. Press Ctrl+C to stop; your points are saved and resume next run.

Install globally instead: `npm i -g @gennode/node`, then run `gennode`.

### Prefer a desktop app?
A desktop node app (Tauri; macOS/Windows/Linux) is **coming soon** — check the [Releases page](https://github.com/Gen-Node/Gen-Node/releases). The CLI here does the same job headlessly today.

## Commands
| Command | What it does |
| --- | --- |
| `npx @gennode/node` | Register this machine and run a node (the default — this is the product) |
| `gennode node` | Same as above: start / resume the node |
| `gennode node status` | Show this node's points, uptime, rank, and capacity |
| `gennode wallet 0x…` | Link the payout wallet to your node |
| `gennode chat` | Open the Gennode bio & AI assistant (secondary feature) |
| `gennode ask "question"` | One-shot question to the assistant |
| `gennode setup` | Choose an assistant backend (cloud credits / local Ollama / Venice key) |
| `gennode help` | Show CLI help |

### Options when starting a node
| Flag | Meaning |
| --- | --- |
| `--wallet 0x…` | Set the payout wallet when starting the node |

By default the node talks to the coordinator at `https://app.gennode.org`. Override with the `GENNODE_COORDINATOR` environment variable if you are self-hosting.

## How points work (v1 — honest scope)
- **Today:** points accrue from **uptime** and a **capacity** score. On registration the node runs a small SHA-256 **CPU benchmark** — this proves real hardware (basic anti-sybil), it is **not** a GPU proof-of-work. Anti-sybil today is wallet linking plus that benchmark; fingerprinting, dedup, and cluster analysis are **planned**.
- **Roadmap:** running real compute jobs (DNA & genome analysis, protein folding, drug discovery, multi-omics, AI inference), the encrypted torrent-like **data layer**, and advanced anti-sybil. These are **not** active yet and are not required to earn today.
- **$GENNODE** has not launched. Points are planned to convert to $GENNODE in an airdrop once the token goes live as a 100% fair launch on Base.

## Assistant (secondary)
The same CLI bundles a bio & AI assistant for coding and science questions (genomics, protein folding, drug discovery, multi-omics, simulation, AI). It is independent of running a node.

```bash
gennode setup                # choose a backend: cloud credits / local Ollama / Venice key
gennode chat                 # interactive chat
gennode ask "Explain how protein folding prediction works"
```

Backends:
- **Cloud credits** — opens the dashboard, links your terminal automatically, and meters usage as credits.
- **Local model** — fully offline via **Ollama** (HuggingFace GGUF models work too): `ollama pull llama3.2`, then `gennode chat --ollama`.
- **Venice key** — bring your own [Venice](https://venice.ai) API key.

Assistant options:
| Flag | Meaning |
| --- | --- |
| `--ollama` | use a local Ollama model (offline) instead of cloud/Venice |
| `--model <name>` | model name (default: Venice `llama-3.3-70b` / Ollama `llama3.2`) |
| `--key <key>` | Venice API key (overrides the saved key / `VENICE_API_KEY`) |

## What gets sent where
- **Local (Ollama) and BYO-key (Venice) assistant modes** send nothing to Gennode — requests go straight to the backend you chose.
- **Node mode** reports your hardware specs (CPU/RAM/GPU model, OS) plus periodic heartbeats to the Gennode coordinator so it can award points; it does not read your files or run third-party code today.
- **Cloud/chat mode** routes assistant requests through the Gennode gateway, which meters usage to track credits.

## Local development (from this repo, before npm publish)
```bash
node packages/node/src/index.mjs            # run a node
node packages/node/src/index.mjs node status
node packages/node/src/index.mjs chat
```

The Gennode assistant persona lives in [`src/prompt.mjs`](./src/prompt.mjs); the node engine is in [`src/node.mjs`](./src/node.mjs).

## Links
[gennode.org](https://gennode.org) · [docs.gennode.org](https://docs.gennode.org) · [app.gennode.org](https://app.gennode.org) · [GitHub](https://github.com/Gen-Node/Gen-Node) · [Releases](https://github.com/Gen-Node/Gen-Node/releases) · [X](https://x.com/gennode)
