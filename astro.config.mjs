import { readFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';

const isDev = process.argv.includes('dev');

// Export-datum van de data-pipeline → sitemap-lastmod. Alle hub-pagina's
// verversen ter plekke bij elke data-export, dus dit is de eerlijke
// hercrawl-hint voor Google (leert het wekelijkse ritme).
const { generated_at: dataGeneratedAt } = JSON.parse(
  readFileSync(new URL('./src/data/feedzzz_items.json', import.meta.url), 'utf8'),
);
const sitemapLastmod = new Date(dataGeneratedAt).toISOString();

export default defineConfig({
  site: 'https://feedzz.online',
  output: 'static',
  // Eén canonieke URL-vorm: directory-build serveert /foo/, dus dwing de
  // trailing slash af. Voorkomt dat Google /x én /x/ als duplicaten crawlt.
  trailingSlash: 'always',
  adapter: isDev ? undefined : cloudflare(),
  i18n: {
    locales: ['nl', 'en'],
    defaultLocale: 'nl',
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
    },
  },
  integrations: [
    sitemap({
      // Alleen de hub-pagina's indexeren. De ~1000 individuele item-stubs
      // (/hf-*, /ph-*, /gh-* + /en/*) zijn dunne spiegels van content die
      // autoritatief op HuggingFace/Product Hunt/GitHub staat → "gecrawld,
      // niet geïndexeerd". Ze krijgen noindex (zie [id].astro) en horen niet
      // in de sitemap. SEO-equity + crawlbudget concentreren op de hub.
      filter: (page) => {
        const path = new URL(page).pathname.replace(/\/$/, '') || '/';
        const HUBS = new Set([
          // Hubs
          '/', '/trends', '/over',
          '/en', '/en/trends', '/en/about',
          // Evergreen roundup-pagina's (gecureerd + zoekwaardig)
          '/trending', '/ai-modellen', '/ai-repos', '/ai-launches',
          '/en/trending', '/en/ai-modellen', '/en/ai-repos', '/en/ai-launches',
        ]);
        // Categorie-hubs (statisch, gecureerd, indexeerbaar) — zie src/lib/categories.ts
        if (/^\/categorie\/[^/]+$/.test(path) || /^\/en\/category\/[^/]+$/.test(path)) return true;
        return HUBS.has(path);
      },
      // Alle opgenomen pagina's zijn data-gedreven en verversen met de export.
      serialize: (item) => ({ ...item, lastmod: sitemapLastmod }),
      i18n: {
        defaultLocale: 'nl',
        locales: { nl: 'nl-NL', en: 'en-US' },
      },
    }),
  ],
  build: { assets: 'assets' },
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
});
