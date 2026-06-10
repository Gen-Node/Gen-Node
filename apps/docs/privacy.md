# Privacy & security

Gennode handles sensitive data (genomes, scientific datasets), so privacy is a first-class design goal — not an afterthought.

## How data stays private
- **Encrypted client-side** — data is encrypted before it ever leaves the owner. Nodes store **shards they cannot read**.
- **Sharded & distributed** — no single node holds a whole file (see the [Data layer](/data-layer)).
- **Access by key** — only the owner's keys decrypt. Nothing is sold or profiled.

## Compute privacy (roadmap)
- **Sealed containers** + **self-host mode** — run jobs 100% locally.
- **Confidential computing (GPU TEE)** — operators can't see data even while it is being processed, with cryptographic attestation.

## For node operators
- You run **sealed workloads** — you provide compute/storage **without seeing user data**.
- Wallet-bound identity + [anti-sybil](/node-network#anti-sybil) keep the network and rewards fair.

## Compliance
GDPR-aware: data minimization, consent-based, owner-controlled. As the network matures, sensitive workloads follow applicable data regulations.

> Found a vulnerability? Please disclose responsibly via the security policy on [GitHub](https://github.com/Gen-Node).
