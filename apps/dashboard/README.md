# @gennode/dashboard

The Gennode operator dashboard at **[app.gennode.org](https://app.gennode.org)** — **Vite + React 18 + TypeScript**, wallet connect via **Privy** (`@privy-io/react-auth`; email, wallet, or Google login).

## Develop
```bash
npm install
npm run dev        # Vite dev server (API calls hit location.origin — run the gateway for live data)
npm run build      # -> dist/
```

## Serving model
In production the dashboard is **not** served by Vite: [`apps/gateway/server.mjs`](../gateway) serves the built `dist/` at `/` with SPA fallback. To see it end-to-end, run `npm run build` here, then start the gateway.

## What it does
- **Connect a wallet** (Privy) — embedded wallets are created for users who don't have one.
- **Your nodes** — points, uptime, rank, capacity and specs via `GET /v1/nodes/by-wallet`.
- **Approve wallet-link codes** from the desktop app / CLI: opening `/?link=<code>` posts to `/v1/node/link-approve` and attaches your wallet to that node.
- **Leaderboard and live network stats** (`/v1/leaderboard`, `/v1/network/stats`), refreshed every 30s.

> One device = one node = one wallet.
