export const siteConfig = {
  name: 'feedzz',
  url: 'https://feedzz.online',
  description: 'Discovery feed voor AI launches, agents, modellen en tools — in real-time.',
  tagline: 'AI launches, hot off the press.',
  twitter: '@feedzz',
  defaultOg: '/og-image.png',
  navigation: [
    { label: 'Feed', href: '/' },
    { label: 'Trending', href: '/trending' },
    { label: 'Models', href: '/ai-modellen' },
    { label: 'Launches', href: '/ai-launches' },
    { label: 'Repos', href: '/ai-repos' },
    { label: 'Over', href: '/over' },
  ],
  footerLinks: [
    { label: 'RSS', href: '/rss.xml' },
    { label: 'Whotofollow', href: 'https://whotofollow.online' },
    { label: 'Debesteaitools', href: 'https://debesteaitools.nl' },
  ],
} as const;
