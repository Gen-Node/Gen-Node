import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Gennode',
  description: 'Private health AI, built for one vertical: bio. Documentation.',
  appearance: 'dark',
  cleanUrls: true,
  lastUpdated: true,
  head: [['link', { rel: 'icon', type: 'image/png', href: '/logo.png' }]],
  themeConfig: {
    logo: '/logo.png',
    nav: [
      { text: 'Introduction', link: '/' },
      { text: 'Run a node', link: '/run-a-node' },
      { text: 'Token', link: '/token' },
      { text: 'Whitepaper', link: '/whitepaper' },
      { text: 'Website', link: 'https://gennode.org' },
    ],
    sidebar: [
      {
        text: 'Overview',
        items: [
          { text: 'Introduction', link: '/' },
          { text: 'How it works', link: '/how-it-works' },
          { text: 'Roadmap', link: '/roadmap' },
        ],
      },
      {
        text: 'Node',
        items: [
          { text: 'Run a node', link: '/run-a-node' },
          { text: 'The network', link: '/node-network' },
        ],
      },
      {
        text: 'Token',
        items: [
          { text: '$GENNODE token', link: '/token' },
          { text: 'Airdrop & points', link: '/airdrop' },
        ],
      },
      {
        text: 'More',
        items: [
          { text: 'Whitepaper', link: '/whitepaper' },
          { text: 'FAQ', link: '/faq' },
          { text: 'Disclaimers', link: '/disclaimers' },
        ],
      },
    ],
    socialLinks: [{ icon: 'x', link: 'https://x.com/gennode' }],
    search: { provider: 'local' },
    footer: {
      message:
        'Beta. Information & wellness only — not medical advice. $GENNODE is a utility token; nothing here is financial advice.',
      copyright: '© 2026 Gennode',
    },
  },
})
