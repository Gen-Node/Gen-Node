// Generates a 1024×1024 brand PNG, then run `npx tauri icon app-icon.png`
// to produce the full icon set in src-tauri/icons/. Self-contained colors so
// it always renders (no dependency on external SVG fills).
import { Resvg } from '@resvg/resvg-js'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const out = path.resolve(__dirname, '..', 'app-icon.png')

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0a1422"/>
      <stop offset="1" stop-color="#06070a"/>
    </linearGradient>
  </defs>
  <rect width="1024" height="1024" rx="220" fill="url(#bg)"/>
  <g transform="translate(512,512) scale(22) translate(-16,-16)" fill="none" stroke="#22d3ee" stroke-width="2.2" stroke-linecap="round">
    <path d="M10 4c0 6 12 6 12 12s-12 6-12 12"/>
    <path d="M22 4c0 6-12 6-12 12s12 6 12 12"/>
    <path d="M11 8h10M11 24h10M9 16h14"/>
  </g>
</svg>`

const png = new Resvg(svg).render().asPng()
fs.writeFileSync(out, png)
console.log('wrote', out, '(' + png.length + ' bytes) — now run: npx tauri icon app-icon.png')
