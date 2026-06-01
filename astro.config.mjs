import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';

const isDev = process.argv.includes('dev');

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
        return HUBS.has(path);
      },
      i18n: {
        defaultLocale: 'nl',
        locales: { nl: 'nl-NL', en: 'en-US' },
      },
    }),
  ],
  build: { assets: 'assets' },
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
});
