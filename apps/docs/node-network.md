# The network

Gennode is a **node-powered network for deep bio & DNA data** — an io.net-style decentralized layer focused on one vertical. Nodes contribute **compute (GPU)** and **storage (disk)**; the network analyzes sensitive biological data privately and at scale.

## Three layers
1. **Compute** — nodes run jobs: DNA & genome analysis, protein folding, drug discovery, multi-omics and AI inference. → [Use cases](/use-cases)
2. **Data (torrent-like)** — datasets, model weights and results are encrypted, chunked, content-addressed and served peer-to-peer across nodes. → [Data layer](/data-layer)
3. **Models** — open models today; a purpose-built **Gennode bio/AI LLM** served across nodes (distributed inference) over time — **built from scratch if needed**.

## How a job flows
```
Demand (researcher / lab / app / a job request)
  → Coordinator   (matches job + data → capable nodes, verifies the result)
  → Nodes         (pull encrypted data from the swarm, compute on GPU, return result)
  → Result stored in the data layer + reward in $GENNODE
```

## Privacy (non-negotiable for bio data)
- Data is **encrypted client-side** before it ever leaves the owner; nodes store **encrypted shards they cannot read**.
- Compute roadmap: **confidential computing (GPU TEE)** + sealed containers so operators can't see data even while it is being processed.
- Owners control access with keys; nothing is sold or profiled.

## Anti-sybil
1 wallet = 1 node identity · device fingerprint · GPU benchmark · storage proofs · cluster analysis.

## Node roles & rewards
A node earns `$GENNODE` for **compute** (GPU jobs), **storage** (holding & serving data shards, proven), and **uptime**. Contribute one or both — see the [Roadmap](/roadmap).
