import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';

const isDev = process.argv.includes('dev');

export default defineConfig({
  site: 'https://feedzzz.online',
  output: 'static',
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
      i18n: {
        defaultLocale: 'nl',
        locales: { nl: 'nl-NL', en: 'en-US' },
      },
    }),
  ],
  build: { assets: 'assets' },
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
});
