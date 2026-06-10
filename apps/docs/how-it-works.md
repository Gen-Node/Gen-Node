# How it works

Gennode is a **decentralized compute network** for bio & AI — an io.net-style network, focused on one vertical: **bio & AI**. You contribute compute by running a node; the network dispatches jobs to nodes; you earn.

## For node operators (supply)
1. **Run a node** — start headless with `npx @gennode/node`, or download the desktop app (macOS / Windows / Linux) from [GitHub Releases](https://github.com/Gen-Node/Gen-Node/releases).
2. **Connect your wallet** — your node identity (keeps the network sybil-resistant and fair).
3. **Stay online** — your machine joins the network and stays online, quietly in your tray.
4. **Earn $GENNODE** — points = `uptime × capacity` (completed jobs add points as real compute goes live); points convert to `$GENNODE` in the airdrop.

## What the nodes solve (demand)
When a job arrives, the coordinator routes it to capable nodes:
- **DNA & genome analysis** — a node runs the job and returns the result.
- **Bio-compute** — protein folding, genomics, molecule & drug discovery.
- **AI inference** — model inference for the bio & AI vertical.

## Architecture (high level)
| Layer | Role |
| --- | --- |
| **Node app** | runs on your machine, contributes **GPU + disk**, completes jobs |
| **Compute** | nodes analyze data — DNA, proteins, multi-omics, AI inference (roadmap) |
| **Data (torrent-like)** | encrypted, sharded data served peer-to-peer across nodes (planned) |
| **Coordinator** | registers nodes, dispatches & verifies jobs, tracks points |
| **On-chain (Base)** | `$GENNODE`, rewards, points → airdrop |

> v1 focuses on **node onboarding + uptime/benchmark points**. Real job execution (AI inference, bio-compute) rolls out next — see the [Roadmap](/roadmap).
