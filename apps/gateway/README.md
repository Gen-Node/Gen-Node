# @gennode/gateway

The Gennode **node coordinator + dashboard**. It tracks the node network (registration, heartbeats, points, leaderboard, network stats) and serves the React dashboard from `apps/dashboard/dist`. Runs on **Node 18+** (or Bun).

## Run
```bash
node server.mjs        # http://localhost:8787  (dashboard at /)
```

## Environment
| Var | Default | Meaning |
| --- | --- | --- |
| `PORT` | `8787` | HTTP port |
| `PUBLIC_URL` | `http://localhost:<PORT>` | base URL used in wallet-link approval URLs |
| `HEARTBEAT_SEC` | `30` | expected heartbeat interval; a node counts as online for ~2.5 missed beats |
| `POINTS_PER_MIN` | `1` | base points awarded per online minute (scaled by node capacity) |

## Node API
The desktop app and `@gennode/node` CLI talk to these endpoints.

- `POST /v1/node/register` — body `{ wallet?, specs, bench, fingerprint }`; returns `{ nodeId, nodeKey, cap, heartbeatSec }`. A positive CPU benchmark (`bench`) is required (basic anti-sybil — proves real hardware). One device (by fingerprint) maps to one node.
- `POST /v1/node/heartbeat` — Bearer `nk_…` (or `{ nodeKey }`); accrues uptime and points (`points += minutes × POINTS_PER_MIN × cap`); returns `{ ok, points, uptimeSec, cap, rank, online, intervalSec }`.
- `POST /v1/node/link-wallet` — Bearer `nk_…`, body `{ address }`; links a payout wallet to the node.
- `POST /v1/node/link-start` — Bearer `nk_…`; returns a short link `code` the dashboard uses to pair a wallet with this node.
- `POST /v1/node/link-approve` — body `{ code, address }`; the dashboard calls this to approve a pending link and attach the wallet to the node.
- `GET /v1/node/me` — Bearer `nk_…`; returns this node's specs, points, uptime, rank, and capacity.
- `GET /v1/nodes/by-wallet?wallet=0x…` — all nodes linked to a wallet (links the desktop app ↔ dashboard).
- `GET /v1/leaderboard` — top 50 nodes by points.
- `GET /v1/network/stats` — `{ nodesTotal, nodesOnline, totalPoints, totalUptimeSec }`.
- `GET /health` — ops liveness check `{ ok }`.

> Points and capacity are v1: uptime × a capacity score (CPU cores, RAM, benchmark). Real compute-job scheduling, the encrypted torrent-like data layer, and advanced anti-sybil (fingerprint dedup, cluster analysis) are roadmap, not yet implemented here.

## Dashboard
- `GET /` (and any non-`/v1` GET) serves the React dashboard built to `apps/dashboard/dist`, with SPA fallback. The dashboard lets operators connect a wallet (Privy), view their nodes (points, uptime, rank, capacity, specs), the leaderboard, and live network stats.

## Notes
- Storage is a local `data.json` (single-process MVP). Swap for SQLite/Postgres for production.
- Deploy behind Caddy/HTTPS.
