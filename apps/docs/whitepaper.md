# Whitepaper

**Gennode — a decentralized compute network for bio & AI.**
*Draft · Chain: Base · Token: $GENNODE · Status: pre-launch*

> Informational and a work in progress. Not financial, investment or legal advice. See [Disclaimers](/disclaimers).

## 1. Abstract
Gennode is an **io.net-style decentralized network for deep bio & DNA data** — focused on one vertical. People run a **node** (a desktop app) that contributes **GPU + storage**; the network **analyzes sensitive biological data** — DNA & genome analysis, protein folding, drug discovery, multi-omics, scientific simulation and AI inference — and stores it in a **torrent-like, encrypted data layer**. Open models run today; a purpose-built **Gennode bio/AI LLM** comes over time (built from scratch if needed). Operators earn **`$GENNODE`**. 100% fair launch; rewards are funded by trading fees, not a token allocation.

## 2. Problem
Bio & AI needs huge GPU compute that is **expensive, centralized and privacy-sensitive** (genomic & scientific data). Generic GPU networks aren't tuned for this vertical.

## 3. Solution
Aggregate **idle community GPUs** into a **privacy-first, bio & AI-focused** compute network. Easy to join (one-click node, like Ollama), fair (wallet identity + anti-sybil), aligned via `$GENNODE`.

## 4. The node app
Cross-platform desktop app (Mac / Windows / Linux), distributed via **GitHub Releases**. Connect wallet → run → earn. Runs in the tray with live points/uptime. A headless CLI is available for servers.

## 5. The network — three layers
1. **Compute** — nodes run jobs: DNA & genome analysis, protein folding, drug discovery, multi-omics, scientific simulation and AI inference.
2. **Data (torrent-like)** — datasets, model weights and results are encrypted, chunked, content-addressed (DHT) and served peer-to-peer; erasure-coded for durability.
3. **Models** — open models today; a purpose-built **Gennode bio/AI LLM** served across nodes over time.

```
Demand → Coordinator (match job + data → nodes, verify) → Nodes (pull encrypted data, compute) → result + reward in $GENNODE
```
A node contributes **GPU**, **disk**, or both.

## 6. Privacy & security
Privacy-first: minimized data; roadmap **sealed / self-hostable execution** + **confidential computing (GPU TEE)** so node operators cannot see the data. GDPR-aware.

## 7. Anti-sybil
1 wallet = 1 node · device fingerprint · benchmark (real GPU) · cluster analysis. Critical for fair points/rewards.

## 8. Token — $GENNODE
Base · ERC-20 (Clanker v4 / Bankr) · 100B fixed, non-mintable. Utility: node rewards, pay-for-compute, governance, holder/staking boosts.

## 9. Tokenomics — 100% fair launch
100% public liquidity · 0 team · 0 pre-mine. **Self-funded by trading fees** (creator ~57% of the 1.2% swap) → treasury / rewards / buyback.

## 10. Points & airdrop
Run a node → points (uptime + capacity + completed jobs) → fee-funded buyback → **Merkle airdrop**. No pre-allocated airdrop tokens.

## 11. Governance
`$GENNODE` holders vote on parameters, supported jobs and treasury. Progressive decentralization.

## 12. Roadmap
Node app + points → token launch → airdrop/growth → real compute → bio-compute. See [Roadmap](/roadmap).

## 13. Risks & disclaimers
Demand (#1 risk), sybil, the difficulty of real distributed compute, legal (`$GENNODE` is a utility token, not a security), and crypto volatility. See [Disclaimers](/disclaimers).
