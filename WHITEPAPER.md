# Gennode — Whitepaper

**Private health AI, built for one vertical: bio.**
*Version 0.1 (draft) · Chain: Base · Token: $GENE · Status: pre-launch*

> Disclaimer: This document is informational and a work in progress. It is not financial, investment, legal or medical advice, nor an offer or solicitation to buy any asset. See §13.

---

## 1. Abstract
Gennode is a private health-AI product that becomes a decentralized compute network. **Today**, users ask health questions through an assistant that is private by design — no logging, no profiling, no data selling — running on Venice's private AI infrastructure. **Over time**, the same intelligence migrates onto a community-run network of GPU **nodes** that also performs biological compute (DNA, protein folding, genomics). The network funds itself: 100% of the token is fair-launched, and **trading fees** — not a team allocation — pay for development, rewards and the community airdrop.

## 2. The Problem
1. **Privacy is gone.** People won't ask Big Tech their most sensitive questions — their health included — because everything is logged and profiled.
2. **Bio-AI compute is expensive and centralized.** Protein folding, molecule discovery and genomics need serious GPU power that a handful of clouds gatekeep.
3. **Generic AI and generic GPU networks aren't enough.** One-size models aren't tuned for health; most DePIN compute sells empty hours to anyone.

## 3. Solution: Gennode
A **vertical** product + network for bio: a private health assistant now, a bio-compute node network next. *Genes meet nodes.*

**Progressive decentralization:** ship a real, working product first (on existing private infra), then decentralize the compute as the community and token economy grow. No vaporware — live from day one.

## 4. Product — Phase 1: Health AI (beta)
- **What:** A private, judgment-free assistant that helps users understand symptoms, lab results and what to ask their doctor. It **never diagnoses**.
- **Who:** Individuals + a **doctor mode** for clinicians (explain, summarize, brainstorm — the final decision and responsibility always rest with the clinician).
- **How it is specialized:** Venice API + a health system-prompt + **retrieval-augmented generation (RAG)** over reputable sources + **guard-rails and triage** (red-flag symptoms → seek care). A fine-tuned open "Gennode model" comes later (Phase 2).

## 5. Architecture
```
User → Coordinator → [P1: Venice] / [P2: Node agent on community GPU] → answer
On-chain (Base): $GENE · fee router · Treasury · RewardDistributor
```
- **Coordinator** routes requests, verifies work, tracks contribution.
- **Node agent** (Phase 2, `npx gennode`) runs sealed model containers on operators' GPUs.
- **On-chain** handles the token, fee routing and reward distribution.

## 6. Privacy & Security
The central challenge of "private AI on someone else's GPU" is solved in phases:
- **Phase A (now):** runs on Venice's private, no-logs infrastructure; the app stores no health data; queries are decoupled from identity.
- **Phase B:** open-source sealed node containers + **self-host mode** (100% local) and **confidential computing (GPU TEE)** — operators cannot see the data, with cryptographic attestation.
- **Phase C (research):** FHE / MPC.

Health data is treated as a regulated special category (GDPR/HIPAA-aware): minimized, not sold, consent-based.

## 7. The Node Network — Phase 2+ (coming)
Community operators run `npx gennode`, contribute GPU power, and earn $GENE for **verified compute** (`compute × difficulty × uptime`, protected by redundancy and canary jobs). Beyond inference, the network runs bio-compute: DNA analysis, protein folding, molecule docking and genomics.

## 8. Token — $GENE
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
No tokens are pre-allocated for the airdrop. Instead, accrued fees **buy $GENE on the market** and distribute it to contributors via a Merkle claim.
- **Phase 1 points:** early use, referrals, feedback, tasks.
- **Phase 2 points:** verified GPU compute.
- **Anti-sybil:** device fingerprinting, behavior analysis, staged verification. Rewards go to real contributors.

## 11. Governance
$GENE holders vote on parameters (fees, reward weights), supported models and treasury use. Governance decentralizes progressively alongside the network.

## 12. Roadmap
| Phase | Focus | Token | Node |
| --- | --- | --- | --- |
| 0 MVP | Venice health AI + guard-rails | – | – |
| 1 Beta | site, beta AI, points, waitlist | – | – |
| 2 Community | growth, doctor mode, RAG | – | – |
| 3 Demand | paying usage, first revenue | – | – |
| 4 TGE | $GENE fair launch (Bankr), airdrop | ✅ | – |
| 5 Network | node client, TEE, compute rewards, bio-compute | ✅ | ✅ |

## 13. Risks & Disclaimers
- **Demand** is the primary risk; the model is volume-dependent.
- **Medical:** Gennode provides health information and wellness support only. It is **not a medical device** and does not diagnose, treat or prescribe. Always consult a clinician; the final decision rests with the user and their doctor.
- **Financial:** $GENE is a utility token. Nothing herein is financial advice or an offer of securities. Crypto is volatile and risky; verify official contract addresses.
- **Legal:** token, reward and health-data structures are reviewed with qualified counsel before launch.

---
*© 2026 Gennode. Draft — subject to change.*
