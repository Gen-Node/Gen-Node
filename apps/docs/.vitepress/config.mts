import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Gennode',
  description: 'Gennode — a decentralized compute network for bio & AI. Run a node, earn $GENNODE. Documentation.',
  appearance: 'dark',
  cleanUrls: true,
  lastUpdated: true,
  head: [['link', { rel: 'icon', type: 'image/svg+xml', href: '/dna.svg' }]],
  themeConfig: {
    logo: '/dna.svg',
    nav: [
      { text: 'Introduction', link: '/' },
      { text: 'Run a node', link: '/run-a-node' },
      { text: 'Token', link: '/token' },
      { text: 'Whitepaper', link: '/whitepaper' },
      { text: 'GitHub', link: 'https://github.com/Gen-Node' },
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
          { text: 'Use cases', link: '/use-cases' },
          { text: 'Data layer', link: '/data-layer' },
          { text: 'Node requirements', link: '/node-requirements' },
        ],
      },
      {
        text: 'Resources',
        items: [
          { text: 'Privacy & security', link: '/privacy' },
          { text: 'Community & links', link: '/community' },
          { text: 'Glossary', link: '/glossary' },
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
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Gen-Node' },
      { icon: 'x', link: 'https://x.com/gennode' },
    ],
    search: { provider: 'local' },
    footer: {
      message:
        'Early access · $GENNODE is a utility token — nothing here is financial advice. Genes meet nodes.',
      copyright: '© 2026 Gennode',
    },
  },
})
