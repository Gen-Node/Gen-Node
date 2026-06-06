# @gennode/node — run Gennode locally

A **private health AI** you run on your own machine (**macOS & Windows**). Powered by the [Venice](https://venice.ai) API, or fully offline with a local [Ollama](https://ollama.com) model. Your questions go only to the backend you choose — Gennode logs nothing.

> Beta. Information & wellness only — **not** a medical device, **not** a diagnosis. Always consult a clinician.

## Requirements
- **Node.js 18+** — macOS: `brew install node` · Windows: [nodejs.org](https://nodejs.org)

## Quick start (Venice)
```bash
# 1) get a key at https://venice.ai, then:
npx @gennode/node login      # paste your Venice API key
npx @gennode/node            # start chatting
```
Or install globally:
```bash
npm i -g @gennode/node
gennode login
gennode
```

## Fully offline (Ollama)
```bash
# install Ollama (https://ollama.com), then:
ollama pull llama3.2
gennode --ollama
```

## One-shot
```bash
gennode ask "What can cause a mild headache and low fever for two days?"
```

## Options
| Flag | Meaning |
| --- | --- |
| `--ollama` | use a local Ollama model (offline) instead of Venice |
| `--model <name>` | model name (default: Venice `llama-3.3-70b` / Ollama `llama3.2`) |
| `--key <key>` | Venice API key (overrides saved key / `VENICE_API_KEY`) |

## Local development (from this repo, before npm publish)
```bash
node packages/node/src/index.mjs login
node packages/node/src/index.mjs
```

The Gennode persona & safety rules live in [`src/prompt.mjs`](./src/prompt.mjs).
