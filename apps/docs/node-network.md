# The network

Gennode is a **node-powered compute layer for biological & health AI** — an io.net-style decentralized network, focused on one vertical.

## Why it exists
Bio & health AI — protein folding, genomics, drug discovery, private health inference — need huge GPU compute that is **expensive, centralized and privacy-sensitive**. Gennode aggregates compute from thousands of community nodes: cheaper, decentralized, and private.

## How jobs flow
```
Demand (researcher / app / a person's health question)
   → Coordinator  (matches job → capable nodes, verifies the result)
   → Nodes        (run the job on idle GPUs)
   → Result + reward in $GENNODE
```

## Privacy
Health and genomic data are sensitive. The network is built **privacy-first**: data is minimized, and (roadmap) sealed / self-hostable execution plus **confidential computing (GPU TEE)** so node operators cannot see the data.

## Anti-sybil
1 wallet = 1 node identity · device fingerprint · benchmark (prove a real GPU) · cluster analysis. Keeps points & rewards fair.

## Phases
- **v1:** node app + uptime/benchmark points.
- **v2:** real job execution — health-AI inference, then bio-compute — with proof-of-compute and paying demand.

See the [Roadmap](/roadmap).
