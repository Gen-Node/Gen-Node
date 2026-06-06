# @gennode/gateway

Metered **Venice proxy + credits + dashboard** for Gennode. OpenAI-compatible. Runs on **Node 18+** (or Bun). The Venice API key stays server-side; users spend **credits**.

## Run
```bash
# set your Venice key (server-side only)
# macOS/Linux:
export VENICE_API_KEY=your_key
# Windows PowerShell:
#   $env:VENICE_API_KEY = "your_key"

node server.mjs        # http://localhost:8787  (dashboard at /)
```

Env:
| Var | Default | Meaning |
| --- | --- | --- |
| `VENICE_API_KEY` | — | your Venice key (required for chat) |
| `PORT` | `8787` | port |
| `GATEWAY_MODEL` | `llama-3.3-70b` | default model |
| `FREE_CREDITS` | `25` | credits granted on signup |

## Endpoints
- `GET /` — dashboard (sign up, chat, see credits)
- `POST /v1/signup` → `{ apiKey, credits }`
- `GET /v1/me` (Bearer `gk_…`) → `{ credits, used }`
- `POST /v1/chat/completions` (Bearer `gk_…`) — OpenAI-style `{ messages }`, deducts 1 credit

## Terminal
```bash
npx @gennode/node connect http://localhost:8787 gk_your_key
npx @gennode/node
```

## Notes
- Storage is a local `data.json` (MVP). Swap for SQLite/Postgres for production.
- **Free credits cost real money** (our Venice balance) — keep small and ship **$GENNODE holder-gating** to stop sybil abuse.
- Deploy behind Caddy/HTTPS on the VPS; never expose `VENICE_API_KEY` to clients.
