# Data layer — torrent-like & private

Deep bio & DNA data is **huge** (a single human genome is ~100 GB raw) and **sensitive**. Gennode moves and stores it the way **BitTorrent** and **IPFS** move data — but **encrypted, replicated and incentivized**.

## How it works
- **Content-addressed** — every file and chunk is identified by its hash, so it's tamper-proof and de-duplicated.
- **Chunked** — large files are split into pieces (like BitTorrent), so many nodes share the load.
- **Encrypted first** — data is encrypted **client-side** before it is sharded. Nodes store **shards they cannot read**.
- **Replicated** — erasure coding (Reed–Solomon) keeps data durable even when nodes go offline.
- **Peer-to-peer** — nodes fetch pieces from many peers in parallel (a swarm); a **DHT** maps content → who holds it, with **no central index**.
- **Access by key** — only the data owner's keys can decrypt. Nothing is sold or profiled.

## Why it matters
- **Scale** — spread terabytes of genomic data across thousands of nodes.
- **Privacy** — encrypted shards; operators never see raw data.
- **Censorship-resistant** — no single point of control or failure.
- **Compute near data** — jobs run where the (encrypted) data already lives.
- **Model distribution** — model weights, including **Gennode's bio model**, are served the same way.

## Earning
A node earns `$GENNODE` for **storing and serving** data shards — proven with storage proofs — on top of compute and uptime. Contribute **GPU**, **disk**, or both.

> Think *private, encrypted BitTorrent for biological data* — with rewards for the people who keep it alive.
