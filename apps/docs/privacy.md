# Privacy & security

Gennode is designed to handle sensitive data (genomes, scientific datasets), so privacy is a first-class design goal — not an afterthought. The protections below describe the planned data layer and compute model; they are part of the roadmap and not yet live.

## How data will stay private (planned)
- **Encrypted client-side** — data is intended to be encrypted before it ever leaves the owner, so nodes store **shards they cannot read**.
- **Sharded & distributed** — no single node will hold a whole file (see the [Data layer](/data-layer)).
- **Access by key** — only the owner's keys decrypt. Nothing is sold or profiled.

## Compute privacy (roadmap)
- **Sealed containers** + **self-host mode** — run jobs 100% locally.
- **Confidential computing (GPU TEE)** — operators cannot see data even while it is being processed, with cryptographic attestation.

## For node operators
- Today, nodes earn for **uptime** and a CPU benchmark that proves real hardware — they do not yet process user data.
- As the network matures, nodes will run **sealed workloads** — providing compute/storage **without seeing user data**.
- Wallet-bound identity + [anti-sybil](/node-network#anti-sybil) keep the network and rewards fair.

## Compliance
GDPR-aware by design: data minimization, consent-based, owner-controlled. As the network matures, sensitive workloads will follow applicable data regulations.

> Found a vulnerability? Please disclose responsibly via the security policy on [GitHub](https://github.com/Gen-Node/Gen-Node).
