import rss from '@astrojs/rss';
import { getAllItems, sourceLabels } from '../lib/data';
import { siteConfig } from '../config/site';
import { useTranslations } from '../i18n/messages';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const items = getAllItems().slice(0, 200);
  const t = useTranslations('nl');
  return rss({
    title: `${t.siteName} — ${t.siteTagline}`,
    description: t.siteDescription,
    site: context.site ?? siteConfig.url,
    items: items.map((it) => ({
      title: `[${sourceLabels[it.source]}] ${it.title}`,
      description: it.tagline,
      link: it.url,
      pubDate: it.created_at ? new Date(it.created_at) : new Date(),
      categories: [it.source, it.type, ...(it.tags || [])].slice(0, 8),
    })),
    customData: '<language>nl-nl</language>',
  });
}
