// One-off: generate logo.png (512) + og.png (1200x630) for the sites.
import { Resvg } from '@resvg/resvg-js'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const webPub = path.resolve(__dirname, '..', '..', 'web', 'public')
const docsPub = path.resolve(__dirname, '..', '..', 'docs', 'public')

const helix = (cx, cy, scale) =>
  `<g transform="translate(${cx},${cy}) scale(${scale}) translate(-16,-16)" fill="none" stroke="#22d3ee" stroke-width="2.2" stroke-linecap="round">
    <path d="M10 4c0 6 12 6 12 12s-12 6-12 12"/>
    <path d="M22 4c0 6-12 6-12 12s12 6 12 12"/>
    <path d="M11 8h10M11 24h10M9 16h14"/>
  </g>`

const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs><linearGradient id="b" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0a1422"/><stop offset="1" stop-color="#06070a"/></linearGradient></defs>
  <rect width="512" height="512" rx="110" fill="url(#b)"/>
  ${helix(256, 256, 11)}
</svg>`

const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0a1422"/><stop offset="1" stop-color="#06070a"/></linearGradient>
    <radialGradient id="glow" cx="78%" cy="40%" r="55%"><stop offset="0" stop-color="rgba(34,211,238,0.18)"/><stop offset="1" stop-color="rgba(34,211,238,0)"/></radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  ${helix(940, 315, 18)}
  <text x="90" y="250" font-family="Inter, Arial, sans-serif" font-size="92" font-weight="800" fill="#e8edf2" letter-spacing="2">GENNODE</text>
  <text x="92" y="320" font-family="Inter, Arial, sans-serif" font-size="38" font-weight="600" fill="#22d3ee">Run a node. Earn $GENNODE.</text>
  <text x="92" y="380" font-family="Inter, Arial, sans-serif" font-size="28" fill="#8aa0ad">Decentralized compute + data for bio &amp; AI</text>
  <text x="92" y="560" font-family="Inter, Arial, sans-serif" font-size="24" fill="#59707e">Genes meet nodes · gennode.org</text>
</svg>`

function render(svg, w) {
  return new Resvg(svg, { fitTo: { mode: 'width', value: w } }).render().asPng()
}

const logo = render(logoSvg, 512)
const og = render(ogSvg, 1200)
for (const dir of [webPub, docsPub]) {
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, 'logo.png'), logo)
}
fs.writeFileSync(path.join(webPub, 'og.png'), og)
console.log('logo.png ->', webPub, '+', docsPub, '(' + logo.length + 'B)')
console.log('og.png   ->', webPub, '(' + og.length + 'B)')
