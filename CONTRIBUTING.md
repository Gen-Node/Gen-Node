# Contributing to Gennode

Thank you for your interest — Gennode is an early-stage, open project and contributions are welcome.

By participating, you agree to abide by our [Code of Conduct](./CODE_OF_CONDUCT.md).

## Repository layout

Monorepo with six workspaces:

| Path | Description | Build |
| --- | --- | --- |
| `apps/web` | Landing page (Vite + React + Tailwind) | `npm install && npm run build` |
| `apps/docs` | Documentation (VitePress) | `npm install && npm run build` |
| `apps/dashboard` | Node dashboard (Vite + React + Privy) — the gateway serves `apps/dashboard/dist` | `npm install && npm run build` |
| `apps/gateway` | Coordinator API (Node; serves the built dashboard) | `npm install` (no build; `npm start` to run) |
| `apps/desktop` | Desktop node app (Tauri + React) | `npm install && npm run tauri build` (requires Rust) |
| `packages/node` | Published node CLI, `npx @gennode/node` (Node) | `npm install` (no build; run `node src/index.mjs`) |

## Local development

Prerequisites: **Node.js 18+** for everything; the desktop app additionally requires the [Tauri prerequisites](https://v2.tauri.app/start/prerequisites/) (Rust toolchain and platform dependencies).

```bash
# landing page → http://localhost:5174
cd apps/web && npm install && npm run dev

# docs → http://localhost:5175
cd apps/docs && npm install && npm run dev

# node dashboard (build, then serve via the gateway)
cd apps/dashboard && npm install && npm run build

# coordinator API (serves apps/dashboard/dist)
cd apps/gateway && npm install && npm start

# desktop node app (requires Rust)
cd apps/desktop && npm install && npm run tauri dev

# headless node CLI
node packages/node/src/index.mjs
```

## Guidelines

- Keep pull requests small and focused — one change per PR.
- Before submitting, run `npm run build` in any workspace you touched (and `npm run typecheck` in `apps/web`).
- Write clear commit messages and describe the intent of the change in the PR.
- This is a bio & DNA / science project — accuracy and clarity matter, in code and in copy.
- By contributing, you agree that your contributions are licensed under the [MIT License](./LICENSE).

## Issues

Open an issue with clear, reproducible steps and your environment (OS, app or CLI version). For security reports, do **not** open a public issue — see [SECURITY.md](./SECURITY.md).
