# How it works

Gennode is a **decentralized compute network** for biological & health AI — an io.net-style network, focused on one vertical: **bio + health**. You contribute compute by running a node; the network dispatches jobs to nodes; you earn.

## For node operators (supply)
1. **Download** the Gennode app (macOS / Windows / Linux) from **GitHub Releases**.
2. **Connect your wallet** — your node identity (keeps the network sybil-resistant and fair).
3. **Run a node** — your idle GPU joins the network and stays online, quietly in your tray.
4. **Earn $GENNODE** — points for uptime + capacity (+ completed jobs); points convert to `$GENNODE` in the airdrop.

## What the nodes solve (demand)
When a job arrives, the coordinator routes it to capable nodes:
- **Health AI** — people ask health questions privately; a node runs the inference and returns the answer.
- **Bio-compute** — protein folding, genomics, molecule & drug discovery.
- **AI inference** — model inference for the bio/health vertical.

## Architecture (high level)
| Layer | Role |
| --- | --- |
| **Node app** | runs on your machine, contributes **GPU + disk**, completes jobs |
| **Compute** | nodes analyze data — DNA, proteins, imaging, health AI |
| **Data (torrent-like)** | encrypted, sharded data served peer-to-peer across nodes |
| **Coordinator** | registers nodes, dispatches & verifies jobs, tracks points |
| **On-chain (Base)** | `$GENNODE`, rewards, points → airdrop |

> v1 focuses on **node onboarding + uptime/benchmark points**. Real job execution (health AI, bio-compute) rolls out next — see the [Roadmap](/roadmap).
