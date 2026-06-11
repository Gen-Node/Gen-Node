# The network

Gennode is a **private, torrent-like node network for heavy bio & health computation** — a decentralized layer focused on one vertical. Nodes contribute **compute** and **storage**; the goal is to analyze sensitive biological data privately and at scale.

## Three layers
1. **Compute** — nodes run jobs: DNA & genome analysis, protein folding, drug discovery, disease research and multi-omics. → [Use cases](/use-cases)
2. **Data (torrent-like) — planned** — on the roadmap, datasets, model weights and results will be encrypted, chunked, content-addressed and served peer-to-peer across nodes. → [Data layer](/data-layer)
3. **Models** — bio AI models the network runs to analyze biological data (protein folding, genomics) — open models today; a purpose-built **Gennode bio model** served across nodes over time.

## How a job flows (planned)
The full flow below describes the network once real compute and the data layer are live:
```
Demand (researcher / lab / app / a job request)
  → Coordinator   (matches job + data → capable nodes, verifies the result)
  → Nodes         (pull encrypted data from the swarm, compute, return result)
  → Result stored in the data layer + reward in $GENNODE
```

## Privacy (planned — a core design goal for bio data)
These privacy properties are part of the roadmap, not yet live:
- Data is intended to be **encrypted client-side** before it ever leaves the owner, so nodes store **encrypted shards they cannot read**.
- Compute roadmap: **confidential computing (GPU TEE)** + sealed containers so operators cannot see data even while it is being processed.
- Owners control access with keys; nothing is sold or profiled.

## Anti-sybil
Today, fairness comes from **wallet linking**, a **CPU benchmark** that proves a node runs on real hardware, and a **device fingerprint** (one device = one node = one wallet). Storage proofs and cluster analysis are **planned**.

## Node roles & rewards
Today, a node earns `$GENNODE` points for **uptime** and proving real hardware. As the network matures, nodes will also earn for **compute** (running jobs) and **storage** (holding & serving data shards, proven) — see the [Roadmap](/roadmap).
