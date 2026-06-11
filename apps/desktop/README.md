# Gennode Desktop

The Gennode node as a desktop app — **Tauri v2 + React 18 + Vite + TypeScript**. Run a node, contribute idle compute to a private, decentralized network for bio & DNA, and earn points. Current release: **v0.1.3** ([Releases](https://github.com/Gen-Node/Gen-Node/releases)).

## Prerequisites
- Node 18+
- Rust toolchain + [Tauri v2 prerequisites](https://v2.tauri.app/start/prerequisites/) for your platform

## Develop
```bash
npm install
npm run tauri dev      # Vite dev server on :1420 + native window
```

## Build
```bash
npm run tauri build    # bundles installers: .exe/.msi (Windows), .dmg (macOS), .AppImage/.deb/.rpm (Linux)
npm run icons          # regenerate app icons from app-icon.png
```

## How it works
- On launch the app registers this device with the coordinator (`https://app.gennode.org`). **One device = one node**, enforced by a hashed device fingerprint (machine id + CPU) plus a short CPU benchmark that proves real hardware — basic anti-sybil.
- **Wallet-first:** connect your wallet before the node starts earning. "Connect wallet" starts a link (`/v1/node/link-start`), opens the dashboard in your browser to approve it (Privy), and the app picks up the linked wallet automatically.
- While running, the app sends a heartbeat every 30s and accrues **points = uptime × capacity** (CPU cores, RAM, benchmark). Points convert to $GENNODE later — the token is not yet launched.
- A system tray icon (Show / Quit) is included.

## Notes
- Prebuilt installers live on [GitHub Releases](https://github.com/Gen-Node/Gen-Node/releases) (latest: `desktop-v0.1.3`). Builds are **unsigned** during early access — Windows SmartScreen / macOS Gatekeeper need a click-through; see the [install guide](https://docs.gennode.org/run-a-node).
- Product name (`Gennode`), bundle identifier (`org.gennode.node`) and window config live in `src-tauri/tauri.conf.json`.
- Prefer a terminal? The [`@gennode/node` CLI](../../packages/node) does the same job headlessly.
