# Contributing to Gennode

Thanks for your interest — Gennode is an early-stage, open project.

## Repo layout
Monorepo:
- `apps/web` — 3D landing page (Vite + React + React Three Fiber + Tailwind)
- `apps/docs` — documentation (VitePress)

## Local development
```bash
# landing page
cd apps/web && npm install && npm run dev    # http://localhost:5174

# docs
cd apps/docs && npm install && npm run dev   # http://localhost:5175
```

## Guidelines
- Keep pull requests small and focused.
- Run `npm run build` (and `npm run typecheck` in `apps/web`) before submitting.
- This is a bio & AI / science project — accuracy and clarity matter.

## Issues
Open an issue with clear, reproducible steps. For security reports, see [SECURITY.md](./SECURITY.md).
