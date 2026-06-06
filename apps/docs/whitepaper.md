# Whitepaper

**Private health AI, built for one vertical: bio.**
*Version 0.1 (draft) · Chain: Base · Token: $GENNODE · Status: pre-launch*

> Informational and a work in progress. Not financial, investment, legal or medical advice, nor an offer of any asset. See [Disclaimers](/disclaimers).

## 1. Abstract
Gennode is a private health-AI product that becomes a decentralized compute network. **Today**, users ask health questions through an assistant that is private by design — no logging, no profiling, no data selling — running on Venice's private AI infrastructure. **Over time**, the same intelligence migrates onto a community-run network of GPU **nodes** that also performs biological compute (DNA, protein folding, genomics). The network funds itself: 100% of the token is fair-launched, and **trading fees** — not a team allocation — pay for development, rewards and the community airdrop.

## 2. The Problem
1. **Privacy is gone.** People won't ask Big Tech their most sensitive questions — health included — because everything is logged and profiled.
2. **Bio-AI compute is expensive and centralized.** Protein folding, molecule discovery and genomics need serious GPU power that a handful of clouds gatekeep.
3. **Generic AI and generic GPU networks aren't enough.** One-size models aren't tuned for health; most DePIN compute sells empty hours to anyone.

## 3. Solution: Gennode
A **vertical** product + network for bio: a private health assistant now, a bio-compute node network next. *Genes meet nodes.* **Progressive decentralization:** ship a real, working product first (on existing private infra), then decentralize the compute as the community and token economy grow.

## 4. Product — Phase 1: Health AI (beta)
- **What:** a private, judgment-free assistant that helps users understand symptoms, lab results and what to ask their doctor. It **never diagnoses**.
- **Who:** individuals + a **doctor mode** for clinicians (the final decision and responsibility always rest with the clinician).
- **How it is specialized:** Venice API + a health system-prompt + **retrieval-augmented generation (RAG)** over reputable sources + **guard-rails and triage**.

## 5. Architecture
```
User → Coordinator → [P1: Venice] / [P2: Node agent on community GPU] → answer
On-chain (Base): $GENNODE · fee router · Treasury · RewardDistributor
```

## 6. Privacy & Security
- **Phase A (now):** runs on Venice's private, no-logs infrastructure; the app stores no health data; queries are decoupled from identity.
- **Phase B:** open-source sealed node containers + **self-host mode** (100% local) and **confidential computing (GPU TEE)** — operators cannot see the data, with cryptographic attestation.
- **Phase C (research):** FHE / MPC.

Health data is treated as a regulated special category (GDPR/HIPAA-aware): minimized, not sold, consent-based.

## 7. Node Network — Phase 2+ (coming)
Community operators run `npx gennode`, contribute GPU power, and earn `$GENNODE` for **verified compute** (`compute × difficulty × uptime`, protected by redundancy and canary jobs). Beyond inference, the network runs bio-compute: DNA analysis, protein folding, molecule docking and genomics.

## 8. Token — $GENNODE
Base · ERC-20 via Clanker v4 (Bankr) · **100,000,000,000 fixed, non-mintable.** Utility: premium access, governance, and (Phase 2) the fuel for node-operator rewards.

## 9. Tokenomics — 100% Fair Launch
**No team allocation. No pre-mine. No dev buy.** Every token enters the open market at launch.

| Allocation | Share |
| --- | --- |
| Public liquidity (fair launch) | **100%** |
| Team / insiders | 0% |
| Dev buy / pre-mine | 0% |

Self-funded by trading fees. Each swap charges 1.2%; the creator share (~57%) is routed on-chain:

| Fee recipient | Share | Purpose |
| --- | --- | --- |
| Treasury (multisig) | 50% | dev, infra, audits, legal, growth |
| Rewards / Airdrop | 35% | fee-funded buyback → distribution to contributors |
| Buyback | 15% | buy pressure, recycled into rewards |

**The flywheel:** real usage → swaps → fees → treasury + rewards + buyback → growth → more usage. Trade-off: with no pre-mine, the treasury is volume-dependent and builds slowly — so **grants** and organic growth fund early development.

## 10. Rewards & Airdrop
No tokens are pre-allocated. Accrued fees **buy $GENNODE on the market** and distribute via a Merkle claim.
- **Phase 1 points:** early use, referrals, feedback, tasks.
- **Phase 2 points:** verified GPU compute.
- **Anti-sybil:** device fingerprinting, behavior analysis, staged verification.

## 11. Governance
$GENNODE holders vote on parameters (fees, reward weights), supported models and treasury use. Governance decentralizes progressively alongside the network.

## 12. Roadmap
See the [Roadmap](/roadmap).

## 13. Risks & Disclaimers
- **Demand** is the primary risk; the model is volume-dependent.
- **Medical:** information and wellness support only; not a medical device; does not diagnose, treat or prescribe.
- **Financial:** $GENNODE is a utility token; nothing herein is financial advice or an offer of securities.
- **Legal:** token, reward and health-data structures are reviewed with qualified counsel before launch.
