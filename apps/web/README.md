# @gennode/web

Gennode landing page — **Vite + React + TypeScript + React Three Fiber + Tailwind**.

```bash
npm install
npm run dev        # http://localhost:5174
npm run typecheck
npm run build      # -> dist/
```

- 3D models (optimized GLB) live in `public/models/`. Prompts: [`../../internal/3D-PROMPTS.md`](../../internal/3D-PROMPTS.md).
- `src/components/Intro.tsx` — opening animation · `DNA.tsx` — hero · `Model3D.tsx` — reusable model viewer.
