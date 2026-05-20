export type Locale = 'nl' | 'en';
export const LOCALES: Locale[] = ['nl', 'en'];
export const DEFAULT_LOCALE: Locale = 'nl';

export const messages = {
  nl: {
    siteName: 'feedzz',
    siteDescription: 'Discovery feed voor AI launches, agents, modellen en tools — in real-time.',
    siteTagline: 'AI launches, hot off the press.',

    nav: {
      feed: 'Feed',
      trending: 'Trending',
      models: 'Modellen',
      launches: 'Launches',
      repos: 'Repos',
      trends: 'Hype-cycle',
      about: 'Over',
    },

    hero: {
      live: 'Live feed',
      updated: 'Bijgewerkt',
      titleA: 'AI launches',
      titleB: 'hot off the press',
      sub: (total: number, trending: number) =>
        `Een doorlopend bijgewerkte feed van nieuwe AI-modellen, agents, demos en tools — verzameld uit HuggingFace, Product Hunt, GitHub trending en meer. ${trending} items zijn nu trending.`,
    },

    filters: {
      all: 'Alles',
      trending: 'Trending',
      categoryAll: 'Alle onderwerpen',
      categoryHeading: 'Onderwerp',
      clearAll: 'Wis filters',
      emptyTitle: 'Geen resultaten',
      emptyBody: 'Geen items die aan alle actieve filters voldoen. Probeer er een paar weg te halen.',
    },

    detail: {
      back: 'Terug naar feed',
      openOn: 'Open op',
      description: 'Beschrijving',
      details: 'Details',
      tags: 'Tags',
      maker: 'Maker',
      language: 'Taal',
      library: 'Library',
      website: 'Website',
      aiRelevance: 'AI relevance',
    },

    time: {
      m: 'm geleden',
      h: 'u geleden',
      d: 'd geleden',
      mo: 'mnd geleden',
    },

    about: {
      title: 'Over feedzz',
      whatHeading: 'Wat zit erin',
      whatIntro: 'Een doorlopend bijgewerkte feed van AI launches uit drie bronnen:',
      sourceHF: 'nieuwe modellen en spaces (demo\'s), gesorteerd op trending score en likes',
      sourcePH: 'AI-gerelateerde launches via de officiële GraphQL API',
      sourceGH: 'repositories die in de afgelopen 30 dagen op trending zijn verschenen',
      stats: (total: number, trending: number, updated: string) =>
        `Op dit moment ${total} items in de feed, waarvan ${trending} trending. Laatste update: ${updated}.`,
      howHeading: 'Hoe werkt het',
      howBody: 'feedzz is een statische site die data ontvangt uit een achterliggende NewsFlux-pipeline. Elke dag worden modellen, spaces, launches en repos opgehaald via officiële API\'s, in een DuckDB-database opgeslagen, en geëxporteerd naar deze site als JSON. Geen runtime database, geen tracking, geen cookies.',
      relatedHeading: 'Verwante sites',
      relatedBody: 'Op zoek naar wie te volgen? Probeer',
    },

    footer: {
      tagline: 'AI launches, hot off the press.',
      dataNote: 'Data uit NewsFlux.',
    },

    aboutPath: '/over',
  },

  en: {
    siteName: 'feedzz',
    siteDescription: 'Discovery feed for AI launches, agents, models and tools — in real time.',
    siteTagline: 'AI launches, hot off the press.',

    nav: {
      feed: 'Feed',
      trending: 'Trending',
      models: 'Models',
      launches: 'Launches',
      repos: 'Repos',
      trends: 'Hype cycle',
      about: 'About',
    },

    hero: {
      live: 'Live feed',
      updated: 'Updated',
      titleA: 'AI launches',
      titleB: 'hot off the press',
      sub: (total: number, trending: number) =>
        `A continuously updated feed of new AI models, agents, demos and tools — pulled from HuggingFace, Product Hunt, GitHub trending and more. ${trending} items are trending right now.`,
    },

    filters: {
      all: 'All',
      trending: 'Trending',
      categoryAll: 'All topics',
      categoryHeading: 'Topic',
      clearAll: 'Clear filters',
      emptyTitle: 'No results',
      emptyBody: 'No items match all active filters. Try removing a few.',
    },

    detail: {
      back: 'Back to feed',
      openOn: 'Open on',
      description: 'Description',
      details: 'Details',
      tags: 'Tags',
      maker: 'Maker',
      language: 'Language',
      library: 'Library',
      website: 'Website',
      aiRelevance: 'AI relevance',
    },

    time: {
      m: 'm ago',
      h: 'h ago',
      d: 'd ago',
      mo: 'mo ago',
    },

    about: {
      title: 'About feedzz',
      whatHeading: 'What\'s inside',
      whatIntro: 'A continuously updated feed of AI launches from three sources:',
      sourceHF: 'new models and spaces (demos), sorted by trending score and likes',
      sourcePH: 'AI-related launches via the official GraphQL API',
      sourceGH: 'repositories that hit trending in the past 30 days',
      stats: (total: number, trending: number, updated: string) =>
        `Currently ${total} items in the feed, of which ${trending} are trending. Last update: ${updated}.`,
      howHeading: 'How it works',
      howBody: 'feedzz is a static site fed by a backend NewsFlux pipeline. Models, spaces, launches and repos are fetched daily via official APIs, stored in a DuckDB database, and exported as JSON to this site. No runtime database, no tracking, no cookies.',
      relatedHeading: 'Related sites',
      relatedBody: 'Looking for who to follow? Try',
    },

    footer: {
      tagline: 'AI launches, hot off the press.',
      dataNote: 'Data from NewsFlux.',
    },

    aboutPath: '/en/about',
  },
} as const;

export function useTranslations(locale: Locale = DEFAULT_LOCALE) {
  return messages[locale] ?? messages[DEFAULT_LOCALE];
}

export function getDateLocale(locale: Locale): string {
  return locale === 'en' ? 'en-US' : 'nl-NL';
}

/** Strip leading /en/ if present, returning the path within the default-locale tree. */
export function pathWithoutLocale(pathname: string): string {
  const m = pathname.match(/^\/(en)(?=\/|$)(.*)$/);
  return m ? (m[2] || '/') : pathname;
}

/** Build a localized URL: /foo (NL) or /en/foo (EN). */
export function localizedHref(path: string, locale: Locale): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (locale === 'nl') return clean;
  return `/en${clean === '/' ? '' : clean}`;
}

/**
 * Path mapping for routes whose slug differs per locale.
 * Each entry maps an internal "key" → { nl, en } absolute paths.
 * Used by getAlternateUrl() to swap to the correct sibling page.
 */
const PATH_ALIASES: Record<string, { nl: string; en: string }> = {
  about: { nl: '/over', en: '/en/about' },
};

/** Strip trailing slash unless it's the root. */
function stripTrailingSlash(p: string): string {
  return p.length > 1 && p.endsWith('/') ? p.slice(0, -1) : p;
}

/**
 * Given the current pathname + locale, return the URL for the same logical
 * page in the OTHER locale. Handles per-locale slug differences.
 */
export function getAlternateUrl(currentPath: string, currentLocale: Locale): string {
  const target: Locale = currentLocale === 'nl' ? 'en' : 'nl';
  const cleaned = stripTrailingSlash(currentPath);

  // 1) Match an aliased route exactly
  for (const aliases of Object.values(PATH_ALIASES)) {
    if (cleaned === aliases[currentLocale]) return aliases[target];
  }

  // 2) Default: strip /en/ → re-prefix for target locale
  const noLocale = pathWithoutLocale(cleaned);
  return localizedHref(noLocale, target);
}
