# Gennode — Whitepaper

**A decentralized compute + data network for bio & AI.**
*Version 0.1 (draft) · Chain: Base · Token: $GENNODE · Status: pre-launch*

> Disclaimer: This document is informational and a work in progress. It is not financial, investment or legal advice, nor an offer or solicitation to buy any asset. See §13.

---

## 1. Abstract
Gennode is a decentralized **compute + data network for bio & AI**. Operators run a **node** (GPU + storage) and the network powers **DNA & genome analysis, protein folding, molecule & drug discovery, multi-omics, scientific simulation, and AI inference**, in exchange for **$GENNODE**. It is built in three layers — **Compute**, a torrent-like **encrypted Data layer**, and **Models** (open models now, a purpose-built Gennode bio/AI LLM later). **Today** it runs on open models via Venice's infrastructure; **over time** the same intelligence migrates onto a community-run network of GPU **nodes**. The network funds itself: 100% of the token is fair-launched, and **trading fees** — not a team allocation — pay for development, rewards and the community airdrop.

## 2. The Problem
1. **Bio & AI compute is expensive and centralized.** Protein folding, molecule discovery and genomics need serious GPU power that a handful of clouds gatekeep.
2. **Scientific data is siloed.** Large datasets are hard to share, store and move securely between researchers.
3. **Generic AI and generic GPU networks aren't enough.** One-size models aren't tuned for science; most DePIN compute sells empty hours to anyone, with no data layer and no domain focus.

## 3. Solution: Gennode
A **vertical** compute + data network for bio & AI. Operators run nodes that power genomics, protein folding, molecule & drug discovery, multi-omics, scientific simulation and AI inference, backed by an encrypted data layer and open models. *Genes meet nodes.*

**Progressive decentralization:** ship a real, working product first (on existing infra), then decentralize the compute as the community and token economy grow. No vaporware — live from day one.

## 4. Product — Phase 1: Bio & AI assistant (beta)
- **What:** A genuinely useful assistant for **coding, science (DNA, genomics, protein folding, molecule & drug discovery, multi-omics), scientific simulation** and general questions — and a guide to running a Gennode node.
- **Who:** Developers, researchers and builders working on bio & AI.
- **How it is specialized:** Venice API + a Gennode bio & AI system-prompt + **retrieval-augmented generation (RAG)** over reputable scientific sources. A purpose-built open "Gennode bio/AI model" comes later (Phase 2).

## 5. Architecture
```
User → Coordinator → [P1: Venice] / [P2: Node agent on community GPU] → answer
On-chain (Base): $GENNODE · fee router · Treasury · RewardDistributor
```
- **Coordinator** routes requests, verifies work, tracks contribution.
- **Node agent** (Phase 2, `npx gennode`) runs sealed model containers on operators' GPUs.
- **Data layer** — a torrent-like, encrypted store moves scientific datasets between nodes.
- **On-chain** handles the token, fee routing and reward distribution.

## 6. Privacy & Security
The central challenge of "compute on someone else's GPU" is solved in phases:
- **Phase A (now):** runs on Venice's infrastructure; queries are decoupled from identity.
- **Phase B:** open-source sealed node containers + **self-host mode** (100% local) and **confidential computing (GPU TEE)** — operators cannot see the data, with cryptographic attestation.
- **Phase C (research):** FHE / MPC.

User and dataset data is treated as a regulated special category (GDPR-aware): minimized, not sold, consent-based, and moved through the encrypted data layer.

## 7. The Node Network — Phase 2+ (coming)
Community operators run `npx gennode`, contribute GPU power, and earn $GENNODE for **verified compute** (`compute × difficulty × uptime`, protected by redundancy and canary jobs). Beyond inference, the network runs bio-compute: DNA & genome analysis, protein folding, molecule docking, multi-omics and scientific simulation.

## 8. Token — $GENNODE
- **Chain:** Base · **Standard:** ERC-20 via Clanker v4 (Bankr) · **Supply:** 100,000,000,000 fixed, non-mintable.
- **Utility:** premium access, governance, and (Phase 2) the fuel for node-operator rewards.

## 9. Tokenomics — 100% Fair Launch
**No team allocation. No pre-mine. No dev buy.** Every token enters the open market at launch.

| Allocation | Share |
| --- | --- |
| Public liquidity (fair launch) | **100%** |
| Team / insiders | 0% |
| Dev buy / pre-mine | 0% |

The network is **self-funded by trading fees**. Each swap charges 1.2%; the creator share (~57%, ≈0.68% of volume) is routed on-chain to project-controlled contracts:

| Fee recipient | Share | Purpose |
| --- | --- | --- |
| Treasury (multisig) | 50% | dev, infra, audits, legal, growth |
| Rewards / Airdrop | 35% | fee-funded buyback → distribution to contributors |
| Buyback | 15% | buy pressure, recycled into rewards |

**The flywheel:** real usage → swaps → fees → treasury + rewards + buyback → growth → more usage. Honest trade-off: with no pre-mine, the treasury is volume-dependent and builds slowly — so **grants** (DeSci/Base/Gitcoin) and organic growth fund early development.

## 10. Rewards & Airdrop
No tokens are pre-allocated for the airdrop. Instead, accrued fees **buy $GENNODE on the market** and distribute it to contributors via a Merkle claim.
- **Phase 1 points:** early use, referrals, feedback, tasks.
- **Phase 2 points:** verified GPU compute.
- **Anti-sybil:** device fingerprinting, behavior analysis, staged verification. Rewards go to real contributors.

## 11. Governance
$GENNODE holders vote on parameters (fees, reward weights), supported models and treasury use. Governance decentralizes progressively alongside the network.

## 12. Roadmap
| Phase | Focus | Token | Node |
| --- | --- | --- | --- |
| 0 MVP | Venice bio & AI assistant | – | – |
| 1 Beta | site, beta AI, points, waitlist | – | – |
| 2 Community | growth, RAG over scientific sources | – | – |
| 3 Demand | paying usage, first revenue | – | – |
| 4 TGE | $GENNODE fair launch (Bankr), airdrop | ✅ | – |
| 5 Network | node client, TEE, compute rewards, bio-compute | ✅ | ✅ |

## 13. Risks & Disclaimers
- **Demand** is the primary risk; the model is volume-dependent.
- **Financial:** $GENNODE is a utility token. Nothing herein is financial advice or an offer of securities. Crypto is volatile and risky; verify official contract addresses.
- **Data:** scientific and personal data is handled in line with GDPR — minimized, consent-based and not sold.
- **Legal:** token, reward and data structures are reviewed with qualified counsel before launch.

---
*© 2026 Gennode. Draft — subject to change.*
