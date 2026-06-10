<div align="center">

# Gennode

**A private, torrent-like decentralized compute network for bio & DNA.**

*Genes meet nodes.*

[Website](https://gennode.org) · [Docs](https://docs.gennode.org) · [App](https://app.gennode.org) · [X @gennode](https://x.com/gennode)

![license](https://img.shields.io/badge/license-MIT-22d3ee)
![status](https://img.shields.io/badge/status-early%20access-818cf8)
![platforms](https://img.shields.io/badge/platforms-macOS%20·%20Windows%20·%20Linux-38bdf8)
![chain](https://img.shields.io/badge/chain-Base-5eead4)
![launch](https://img.shields.io/badge/launch-100%25%20fair-a78bfa)

</div>

Gennode is a private, torrent-like decentralized compute network for heavy bio & health computation — DNA & genome analysis, protein folding, drug discovery, disease research, and genomics. Run a node, contribute idle GPU and storage, and earn points for uptime and capacity. Big, sensitive datasets are stored torrent-like: encrypted and sharded across community machines. Points convert to `$GENNODE` in a future airdrop.

## Run a node

This is the primary way to participate. Pick either option — both register your node and start earning points.

### Desktop app

A lightweight desktop node for **macOS, Windows, and Linux**, built with Tauri. It runs quietly in the tray and shows live points and uptime.

1. Download the installer from [GitHub Releases](https://github.com/Gen-Node/Gen-Node/releases). Desktop builds are coming soon — check the releases page for the latest status.
2. Install and open the app.
3. Link a wallet — this is your node identity and your payout address.
4. Click **Start node**. Your idle GPU and storage join the network.

### Headless CLI

Prefer the command line, or running on a server without a GUI?

```bash
npx @gennode/node
```

This registers your node and starts earning. Link a payout wallet with:

```bash
gennode wallet 0x…
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
- **Anti-sybil (today):** wallet linking plus a basic CPU benchmark. Device fingerprinting, deduplication, and cluster analysis are planned.

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
│  ├─ web/       # landing page              (Vite + React + Tailwind)
│  ├─ docs/      # documentation             (VitePress)
│  ├─ gateway/   # coordinator API + dashboard (Node)
│  └─ desktop/   # desktop node app          (Tauri + React)
├─ packages/
│  └─ node/      # published node CLI        (npx @gennode/node)
└─ .github/      # workflows + org profile
```

## Contributing & security

- Contributions are welcome — see [CONTRIBUTING.md](./CONTRIBUTING.md).
- Found a vulnerability? Please report it privately — see [SECURITY.md](./SECURITY.md).

## Disclaimer

Early-access software under active development. `$GENNODE` is a planned utility token and is not yet launched; nothing in this repository is financial advice or an offer of securities.

## License

[MIT](./LICENSE)
