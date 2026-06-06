<div align="center">

# 🧬 Gennode

**Private health AI, built for one vertical: bio.**

[Website (soon)] · [Docs](./apps/docs) · [Whitepaper](./WHITEPAPER.md) · [𝕏 @gennode](https://x.com/gennode)

![license](https://img.shields.io/badge/license-MIT-22d3ee)
![status](https://img.shields.io/badge/status-beta-818cf8)
![chain](https://img.shields.io/badge/chain-Base-38bdf8)
![launch](https://img.shields.io/badge/launch-100%25%20fair-5eead4)

</div>

Ask your health questions privately — **no logging, no profiling, no data selling**. Powered today by Venice; tomorrow by a community network of GPU **nodes** that also runs bio-compute (DNA, protein folding, genomics).

> **Genes meet nodes.**

## What is Gennode?

- **Now — Health AI (beta):** a private, judgment-free assistant that helps you understand symptoms and lab results, and what to ask your doctor. It **never diagnoses**.
- **Coming — Node network:** run a node, contribute GPU power, and earn `$GENNODE` for verified compute.

**Progressive decentralization:** ship a real, working product first; decentralize the compute as the community and token grow.

## Monorepo

```
gennode/
├─ apps/
│  ├─ web/    # 3D landing page  (Vite + React + React Three Fiber + Tailwind)
│  └─ docs/   # documentation    (VitePress)
├─ PLAN.md            # master plan
├─ WHITEPAPER.md      # whitepaper
├─ LAUNCH-PLAN.md     # fair-launch playbook
├─ LAUNCH-CHECKLIST.md
└─ 3D-PROMPTS.md      # 3D asset prompts
```

## Run Gennode locally (health AI node)

Run a private health AI on your own machine — **macOS & Windows** — via the Venice API or a fully offline Ollama model. See [`packages/node`](./packages/node).

```bash
npx @gennode/node setup     # cloud credits (auto-opens dashboard) · local model · Venice key
npx @gennode/node           # chat
```

## Token — `$GENNODE`

Base · ERC-20 (Clanker v4 / Bankr) · **100,000,000,000 fixed** · **100% fair launch** — no team allocation, no pre-mine, no dev buy. Treasury, rewards and the airdrop are funded **entirely by trading fees**. See the [Whitepaper](./WHITEPAPER.md) and [tokenomics](./apps/docs/token.md).

## Roadmap

`MVP → Beta → Community → Demand → TGE (fair launch) → Node network`. Full [roadmap](./apps/docs/roadmap.md).

## Disclaimers

Beta software. Provides general health **information and wellness support only** — it is **not a medical device** and does not diagnose, treat or prescribe. Always consult a clinician; the final decision rests with you and your doctor. `$GENNODE` is a utility token; nothing here is financial advice or an offer of securities.

## License

[MIT](./LICENSE)
