# @gennode/node — run Gennode locally

A **private health AI** you run on your own machine (**macOS & Windows**). Powered by the [Venice](https://venice.ai) API, or fully offline with a local [Ollama](https://ollama.com) model. Your questions go only to the backend you choose — Gennode logs nothing.

> Beta. Information & wellness only — **not** a medical device, **not** a diagnosis. Always consult a clinician.

## Requirements
- **Node.js 18+** — macOS: `brew install node` · Windows: [nodejs.org](https://nodejs.org)

## Quick start
```bash
npx @gennode/node setup     # choose: cloud credits / local model / Venice key
npx @gennode/node           # start chatting
```
- **Cloud credits** — opens your dashboard in the browser, links the terminal **automatically**, and shows your usage.
- **Local model** — fully private, runs on your machine via **Ollama** (HuggingFace GGUF models work too).
- **Venice key** — bring your own key (private).

Install globally instead: `npm i -g @gennode/node` then `gennode setup`.

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
