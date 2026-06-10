# @gennode/gateway

The Gennode **coordinator + dashboard**. It tracks the node network (registration, heartbeats, points, leaderboard) and also runs an optional metered, OpenAI-compatible **assistant proxy** with a credits system. Runs on **Node 18+** (or Bun). Upstream inference keys stay server-side; assistant users spend **credits**.

## Run
```bash
# macOS/Linux:
export VENICE_API_KEY=your_key
# Windows PowerShell:
#   $env:VENICE_API_KEY = "your_key"

node server.mjs        # http://localhost:8787  (dashboard at /)
```

## Environment
| Var | Default | Meaning |
| --- | --- | --- |
| `PORT` | `8787` | HTTP port |
| `PUBLIC_URL` | `http://localhost:<PORT>` | base URL used in device-link verify URLs |
| `POINTS_PER_MIN` | `1` | base points awarded per online minute (scaled by node capacity) |
| `HEARTBEAT_SEC` | `30` | expected heartbeat interval; a node counts as online for ~2.5 missed beats |
| `FREE_CREDITS` | `25` | assistant credits granted on signup |
| `WALLET_BONUS` | `25` | bonus assistant credits when a wallet is linked |
| `DEFAULT_PROVIDER` | `venice` | default assistant provider (`venice` or `surplus`) |
| `VENICE_API_KEY` | — | Venice key (private tier; required for the assistant) |
| `VENICE_MODEL` | `llama-3.3-70b` | model for the Venice/private tier |
| `VENICE_CREDITS` | `2` | credits charged per Venice request |
| `SURPLUS_API_KEY` | — | Surplus Intelligence key (cheap/general tier) |
| `SURPLUS_MODEL` | `claude-opus-4.8` | model for the Surplus/cheap tier |
| `SURPLUS_CREDITS` | `1` | credits charged per Surplus request |

## Node network API
The desktop app and `@gennode/node` CLI talk to these endpoints.

- `POST /v1/node/register` — body `{ wallet?, specs, bench, fingerprint }`; returns `{ nodeId, nodeKey, cap, heartbeatSec }`. A positive CPU benchmark (`bench`) is required (basic anti-sybil — proves real hardware).
- `POST /v1/node/heartbeat` — Bearer `nk_…` (or `{ nodeKey }`); accrues uptime and points (`points += minutes × POINTS_PER_MIN × cap`); returns `{ ok, points, uptimeSec, cap, rank, online, intervalSec }`.
- `POST /v1/node/link-wallet` — Bearer `nk_…`, body `{ address }`; links a payout wallet to the node.
- `GET /v1/node/me` — Bearer `nk_…`; returns this node's specs, points, uptime, rank, and capacity.
- `GET /v1/nodes/by-wallet?wallet=0x…` — all nodes linked to a wallet (links the desktop app ↔ dashboard).
- `GET /v1/leaderboard` — top 50 nodes by points.
- `GET /v1/network/stats` — `{ nodesTotal, nodesOnline, totalPoints, totalUptimeSec }`.

> Points and capacity are v1: uptime × a capacity score (CPU cores, RAM, benchmark). Real compute-job scheduling, the encrypted data layer, and advanced anti-sybil (fingerprint dedup, cluster analysis) are roadmap, not yet implemented here.

## Assistant API (optional)
- `GET /` — dashboard (sign up, link a wallet, chat, see credits).
- `GET /health` — `{ ok, default, providers }`.
- `POST /v1/signup` → `{ apiKey, credits }`.
- `GET /v1/me` (Bearer `gk_…`) → `{ name, credits, used, wallet }`.
- `POST /v1/wallet/link` (Bearer `gk_…`, body `{ address, code? }`) — links a wallet to the account (grants `WALLET_BONUS` once); can approve a pending device-link `code`.
- `POST /v1/chat/completions` (Bearer `gk_…`) — OpenAI-style `{ messages, model?, tier?, provider?, temperature? }`; deducts the provider's credit cost. `tier: "private"` → Venice, `tier: "cheap"` → Surplus.
- Device link (terminal auto-pairing): `POST /v1/device/start` → `{ code, verifyUrl }`, `GET /v1/device/poll?code=…`, `POST /v1/device/approve`.

## Connect the CLI to a self-hosted gateway
```bash
npx @gennode/node connect http://localhost:8787 gk_your_key
gennode chat
```

## Notes
- Storage is a local `data.json` (single-process MVP). Swap for SQLite/Postgres for production.
- Deploy behind Caddy/HTTPS; never expose upstream provider keys to clients.
