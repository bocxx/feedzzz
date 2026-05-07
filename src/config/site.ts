export const siteConfig = {
  name: 'feedzzz',
  url: 'https://feedzzz.online',
  description: 'Discovery feed voor AI launches, agents, modellen en tools — in real-time.',
  tagline: 'AI launches, hot off the press.',
  twitter: '@feedzzz',
  defaultOg: '/og-image.png',
  navigation: [
    { label: 'Feed', href: '/' },
    { label: 'Trending', href: '/?filter=trending' },
    { label: 'Models', href: '/?source=huggingface' },
    { label: 'Launches', href: '/?source=producthunt' },
    { label: 'Repos', href: '/?source=github' },
    { label: 'Over', href: '/over' },
  ],
  footerLinks: [
    { label: 'RSS', href: '/rss.xml' },
    { label: 'Whotofollow', href: 'https://whotofollow.online' },
    { label: 'Debesteaitools', href: 'https://debesteaitools.nl' },
  ],
} as const;
