/**
 * feedzz.online → aiblik.nl (301-worker)
 *
 * Besluit Cirsten, 13 november 2026 (aiblik/docs/besluiten.md): alles van
 * newsflux gaat naar ai/blik en de oude sites verdwijnen. feedzz.online krijgt
 * daarom net als hetlaatsteainieuws.nl, aiplatformmkb.nl, debesteaitools.nl en
 * ainieuwsradar.nl een 301 naar www.aiblik.nl, in één sprong.
 *
 * De worker serveert geen pagina's. Alleen wat in ./bewaar staat (robots.txt,
 * de oude sitemaps en het favicon) geeft nog 200: Google moet de oude adressen
 * kunnen blijven ophalen om de 301's te zien (zelfde aanpak als BEWAAR bij
 * DBAT). Die bestanden serveert Cloudflare uit de assets vóór deze worker draait.
 *
 * Elk ander verzoek, op http of https, met of zonder www, met of zonder slash,
 * gaat naar de dichtstbijzijnde pagina op ai/blik. De querystring gaat niet mee.
 *
 * De Astro-site in src/pages blijft voorlopig in de repo, maar wordt niet meer
 * gebouwd of geserveerd (wrangler.toml: `main` wijst hierheen, assets uit ./bewaar).
 *
 * Kaart: aiblik/docs/features/satellieten-301.md
 * Test: npm run test:redirects
 */

const DOEL = 'https://www.aiblik.nl';

/** Waar alles heen gaat wat hieronder niet staat, ook de losse items (/gh-..., /ph-...). */
const STANDAARD = '/radar/';

/*
 * Doelen staan in de vorm die ai/blik met 200 serveert (overzicht met slash,
 * los bestand zonder), zodat er geen tweede sprong ontstaat. Op 13-11-2026 elk
 * doel met curl op www.aiblik.nl gecontroleerd: 200, geen redirect.
 */

/** Vaste paden (zonder slash aan het eind, kleine letters). De Engelse kant staat ernaast. */
const EXACT: Record<string, string> = {
  '/': '/radar/',
  '/en': '/radar/',
  '/trending': '/radar/',
  '/en/trending': '/radar/',
  '/trends': '/radar/hype/',
  '/en/trends': '/radar/hype/',
  '/ai-launches': '/nieuws/ai-feature-tijdlijn',
  '/en/ai-launches': '/nieuws/ai-feature-tijdlijn',
  '/ai-modellen': '/nieuws/ai-feature-tijdlijn',
  '/en/ai-modellen': '/nieuws/ai-feature-tijdlijn',
  '/ai-repos': '/voor/developer',
  '/en/ai-repos': '/voor/developer',
  '/over': '/over/',
  '/en/about': '/over/',
  '/rss.xml': '/rss.xml',
  '/en/rss.xml': '/rss.xml',
};

/** /categorie/<cat> en /en/category/<cat>. Onbekende categorie: STANDAARD. */
const CATEGORIE: Record<string, string> = {
  agents: '/dossier/ai-agents/',
  claude: '/dossier/anthropic-claude/',
  coding: '/voor/developer',
  fundamentals: '/dossier/open-source-lokale-llms/',
  'tool-insights': '/tools/',
  official: '/nieuws/ai-feature-tijdlijn',
  research: '/radar/wetenschap/',
  business: '/mkb',
  creative: '/tools/',
  branding: '/tools/',
  beginners: '/dossier/ai-uitgelegd/',
};

/** Normaliseer een pad: decoderen, kleine letters, dubbele en afsluitende slashes weg. */
function normaliseer(pathname: string): string {
  let p = pathname;
  try {
    p = decodeURIComponent(p);
  } catch {
    // ongeldige %-codering: het pad zoals het binnenkwam
  }
  p = p.toLowerCase().replace(/\/{2,}/g, '/');
  p = p.replace(/\/index\.html?$/, '/').replace(/\.html?$/, '');
  if (p.length > 1) p = p.replace(/\/+$/, '');
  return p || '/';
}

/** Het pad op ai/blik voor een oud feedzz-pad. */
export function doelPad(pathname: string): string {
  const p = normaliseer(pathname);
  if (Object.hasOwn(EXACT, p)) return EXACT[p];

  const m = p.match(/^(?:\/en\/category|\/categorie)\/([^/]+)/);
  if (m) return Object.hasOwn(CATEGORIE, m[1]) ? CATEGORIE[m[1]] : STANDAARD;

  return STANDAARD;
}

/** Volledige doel-URL voor een binnenkomende request-URL. */
export function redirectDoel(requestUrl: string): string {
  return DOEL + doelPad(new URL(requestUrl).pathname);
}

/**
 * Hoe lang een browser de 301 mag onthouden. Kort gehouden zodat terugdraaien
 * werkt voor wie al geweest is. Na een rustige week mag dit naar 86400.
 */
const CACHE_SECONDEN = 3600;

export default {
  async fetch(request: Request): Promise<Response> {
    return new Response(null, {
      status: 301,
      headers: {
        Location: redirectDoel(request.url),
        'Cache-Control': `public, max-age=${CACHE_SECONDEN}`,
      },
    });
  },
};
