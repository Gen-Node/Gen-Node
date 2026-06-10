# Whitepaper

**Gennode — a decentralized compute network for bio & AI.**
*Draft · Chain: Base · Token: $GENNODE · Status: pre-launch*

> Informational and a work in progress. Not financial, investment or legal advice. See [Disclaimers](/disclaimers).

## 1. Abstract
Gennode is an **io.net-style decentralized network for deep bio & DNA data** — focused on one vertical. People run a **node** that contributes **compute + storage**. Today, nodes earn for **uptime** and a CPU benchmark that proves real hardware. On the roadmap, the network will **analyze sensitive biological data** — DNA & genome analysis, protein folding, drug discovery, multi-omics, scientific simulation and AI inference — and store it in a **torrent-like, encrypted data layer (planned)**. Open models run today; a purpose-built **Gennode bio/AI LLM** comes over time. Operators earn **`$GENNODE`**. `$GENNODE` is not yet launched; it is planned as a 100% fair launch with rewards funded by trading fees, not a token allocation.

## 2. Problem
Bio & AI needs huge GPU compute that is **expensive, centralized and privacy-sensitive** (genomic & scientific data). Generic GPU networks aren't tuned for this vertical.

## 3. Solution
Aggregate **idle community GPUs** into a **privacy-first, bio & AI-focused** compute network. Easy to join (one-click node, like Ollama), fair (wallet identity + anti-sybil), aligned via `$GENNODE`.

## 4. The node app
A headless CLI is **available now** (`npx @gennode/node`): register and earn on servers or any machine. A cross-platform desktop app (Mac / Windows / Linux) is **available** (early access) via **GitHub Releases** — connect wallet → run → earn, with live points/uptime in the tray. A GPU is recommended but not required.

## 5. The network — three layers
1. **Compute** — nodes run jobs: DNA & genome analysis, protein folding, drug discovery, multi-omics, scientific simulation and AI inference (**roadmap**).
2. **Data (torrent-like) — planned** — datasets, model weights and results will be encrypted, chunked, content-addressed (DHT) and served peer-to-peer; erasure-coded for durability.
3. **Models** — open models today; a purpose-built **Gennode bio/AI LLM** served across nodes over time.

The planned end-to-end flow, once compute and the data layer are live:
```
Demand → Coordinator (match job + data → nodes, verify) → Nodes (pull encrypted data, compute) → result + reward in $GENNODE
```
A node contributes **compute**, **disk**, or both.

## 6. Privacy & security
Privacy-first by design. On the roadmap: minimized data, **sealed / self-hostable execution** and **confidential computing (GPU TEE)** so node operators cannot see the data. GDPR-aware. These protections are planned, not yet live.

## 7. Anti-sybil
Today: **wallet linking** + a **CPU benchmark** that proves real hardware. A "1 wallet = 1 node" rule, device fingerprinting and cluster analysis are **planned**. Critical for fair points/rewards.

## 8. Token — $GENNODE
Planned: Base · ERC-20 (Clanker v4 / Bankr) · 100B fixed, non-mintable. Utility: node rewards, pay-for-compute, governance, holder/staking boosts. Not yet launched.

## 9. Tokenomics — 100% fair launch
Planned as 100% public liquidity · 0 team · 0 pre-mine. **Self-funded by trading fees** (creator ~57% of the 1.2% swap) → treasury / rewards / buyback.

## 10. Points & airdrop
Run a node → points (`uptime × capacity`; completed jobs add points as real compute goes live) → fee-funded buyback → **Merkle airdrop**. No pre-allocated airdrop tokens.

## 11. Governance
`$GENNODE` holders vote on parameters, supported jobs and treasury. Progressive decentralization.

## 12. Roadmap
Node app + points → token launch → airdrop/growth → real compute → bio-compute. See [Roadmap](/roadmap).

## 13. Risks & disclaimers
Demand (#1 risk), sybil, the difficulty of real distributed compute, legal (`$GENNODE` is a utility token, not a security), and crypto volatility. See [Disclaimers](/disclaimers).
