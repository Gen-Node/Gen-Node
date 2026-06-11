<div align="center">

<img src="https://raw.githubusercontent.com/Gen-Node/Gen-Node/main/apps/web/public/logo.png" width="120" alt="Gennode">

# Gennode

**A private, torrent-like decentralized compute network for bio & DNA.**

*Genes meet nodes.*

[Website](https://gennode.org) · [Docs](https://docs.gennode.org) · [App](https://app.gennode.org) · [Releases](https://github.com/Gen-Node/Gen-Node/releases) · [npm](https://www.npmjs.com/package/@gennode/node) · [X @gennode](https://x.com/gennode)

[![release](https://img.shields.io/github/v/release/Gen-Node/Gen-Node?label=desktop&color=22d3ee)](https://github.com/Gen-Node/Gen-Node/releases/latest)
[![npm](https://img.shields.io/npm/v/%40gennode%2Fnode?color=38bdf8)](https://www.npmjs.com/package/@gennode/node)
[![desktop build](https://img.shields.io/github/actions/workflow/status/Gen-Node/Gen-Node/desktop-release.yml?label=desktop%20build)](https://github.com/Gen-Node/Gen-Node/actions/workflows/desktop-release.yml)
[![license](https://img.shields.io/github/license/Gen-Node/Gen-Node?color=5eead4)](./LICENSE)
![chain](https://img.shields.io/badge/chain-Base-818cf8)
![launch](https://img.shields.io/badge/launch-100%25%20fair-a78bfa)

</div>

Gennode is a private, torrent-like decentralized compute network for heavy bio & health computation — DNA & genome analysis, protein folding, drug discovery, disease research, and genomics. Run a node, contribute idle compute, and earn points for uptime × capacity. Big, sensitive datasets will be stored torrent-like (planned): encrypted and sharded across community machines. Points convert to `$GENNODE` in a future airdrop.

<div align="center">

<img src="https://raw.githubusercontent.com/Gen-Node/Gen-Node/main/apps/web/public/og.png" alt="Gennode — genes meet nodes" width="720">

</div>

## Run a node

This is the primary way to participate. Pick either option — both register your node and start earning points.

### Desktop app

A lightweight desktop node for **macOS, Windows, and Linux**, built with Tauri. It runs quietly in the tray and shows live points and uptime.

| Platform | Download |
| --- | --- |
| **Windows 10/11** (x64) | [`Gennode_0.1.3_x64-setup.exe`](https://github.com/Gen-Node/Gen-Node/releases/download/desktop-v0.1.3/Gennode_0.1.3_x64-setup.exe) (recommended) · [`.msi`](https://github.com/Gen-Node/Gen-Node/releases/download/desktop-v0.1.3/Gennode_0.1.3_x64_en-US.msi) for managed/silent installs |
| **macOS** — Apple Silicon (M1–M4) | [`Gennode_0.1.3_aarch64.dmg`](https://github.com/Gen-Node/Gen-Node/releases/download/desktop-v0.1.3/Gennode_0.1.3_aarch64.dmg) |
| **macOS** — Intel | [`Gennode_0.1.3_x64.dmg`](https://github.com/Gen-Node/Gen-Node/releases/download/desktop-v0.1.3/Gennode_0.1.3_x64.dmg) |
| **Linux** — any distro | [`Gennode_0.1.3_amd64.AppImage`](https://github.com/Gen-Node/Gen-Node/releases/download/desktop-v0.1.3/Gennode_0.1.3_amd64.AppImage) (`chmod +x` first) |
| **Linux** — Ubuntu/Debian | [`Gennode_0.1.3_amd64.deb`](https://github.com/Gen-Node/Gen-Node/releases/download/desktop-v0.1.3/Gennode_0.1.3_amd64.deb) |
| **Linux** — Fedora/RHEL | [`Gennode-0.1.3-1.x86_64.rpm`](https://github.com/Gen-Node/Gen-Node/releases/download/desktop-v0.1.3/Gennode-0.1.3-1.x86_64.rpm) |

Always grab the newest version from the [latest release](https://github.com/Gen-Node/Gen-Node/releases/latest).

> **Note:** early-access builds are not code-signed yet, so Windows SmartScreen and macOS Gatekeeper will warn on first launch — a one-time click-through. See [the install guide](https://docs.gennode.org/run-a-node) for the exact steps.

1. Download and install the app.
2. Link a wallet — this is your node identity and your payout address.
3. Click **Start node**. Your machine starts earning points for uptime × capacity.

### Headless CLI

Prefer the command line, or running on a server without a GUI? The CLI is published as [`@gennode/node` on npm](https://www.npmjs.com/package/@gennode/node).

```bash
npx @gennode/node --wallet 0xYOUR_WALLET
```

That one line registers your node, links your payout wallet, and starts earning. You can also skip the flag and link later:

```bash
npx @gennode/node            # start a node
npm i -g @gennode/node       # optional: install the `gennode` command globally
gennode wallet 0xYOUR_WALLET # link a payout wallet (or do it at app.gennode.org)
gennode node status          # points, uptime & rank
```

See [`packages/node`](./packages/node) for details.

## What is Gennode?

A private, torrent-like decentralized compute network for heavy bio & health computation, built in three layers:

| Layer | What it does | Status |
| --- | --- | --- |
| **Compute** | Nodes power DNA & genome analysis, protein folding, drug discovery, disease/health research, genomics, and multi-omics. AI models for genomics and protein analysis run on the network as a compute method. | Roadmap |
| **Data** | A torrent-like encrypted data layer: large, sensitive scientific datasets are encrypted, sharded, and served peer-to-peer across nodes (like BitTorrent/IPFS but encrypted and incentivized), with a DHT and erasure coding. | Planned |
| **Models** | Open bio models today; a purpose-built Gennode bio model the network runs to analyze biological data later. | Open models live |

**Progressive decentralization:** ship a real, working product first; add real compute jobs and the data layer as the network and the token economy grow.

## How you earn

- **Points = uptime × capacity.** Today, nodes earn for staying online and for a CPU benchmark that proves real hardware. Real compute jobs are on the roadmap.
- Points convert to **`$GENNODE`** in a future airdrop.
- **Anti-sybil (today):** wallet linking, a CPU benchmark that proves real hardware, and a one-device-one-node fingerprint. Deduplication heuristics and cluster analysis are planned.

## Token — `$GENNODE`

`$GENNODE` is not launched yet. The planned design:

- **Chain:** Base · **Standard:** ERC-20 (Clanker v4 via Bankr).
- **100% fair launch** — no team allocation, no pre-mine, no insider buy.
- Treasury, node rewards, and the airdrop are funded entirely by trading fees.

See the [Whitepaper](https://docs.gennode.org/whitepaper).

## Monorepo

```
gennode/
├─ apps/
│  ├─ web/        # landing page         (Vite + React + Tailwind)
│  ├─ docs/       # documentation        (VitePress)
│  ├─ dashboard/  # node dashboard       (Vite + React + Privy → app.gennode.org)
│  ├─ gateway/    # coordinator API      (Node; serves the built dashboard)
│  └─ desktop/    # desktop node app     (Tauri + React)
├─ packages/
│  └─ node/       # published node CLI   (npx @gennode/node)
└─ .github/       # workflows + org profile
```

## Contributing & security

- Contributions are welcome — see [CONTRIBUTING.md](./CONTRIBUTING.md) and our [Code of Conduct](./CODE_OF_CONDUCT.md).
- Found a vulnerability? Please report it privately — see [SECURITY.md](./SECURITY.md).

## Disclaimer

Early-access software under active development. `$GENNODE` is a planned utility token and is not yet launched; nothing in this repository is financial advice or an offer of securities.

## License

[MIT](./LICENSE)
