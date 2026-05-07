import payload from '../data/feedzzz_items.json';
import type { FeedItem, FeedPayload } from '../types/feed';

const data = payload as unknown as FeedPayload;

export function getAllItems(): FeedItem[] {
  return data.items;
}

export function getGeneratedAt(): string {
  return data.generated_at;
}

export function getItemById(id: string): FeedItem | undefined {
  return data.items.find((i) => i.id === id);
}

export function getTrending(limit = 24): FeedItem[] {
  return data.items.filter((i) => i.is_trending).slice(0, limit);
}

export function getBySource(source: string, limit = 100): FeedItem[] {
  return data.items.filter((i) => i.source === source).slice(0, limit);
}

export function getCounts() {
  const total = data.items.length;
  const trending = data.items.filter((i) => i.is_trending).length;
  const bySource: Record<string, number> = {};
  const byCategory: Record<string, number> = {};
  for (const i of data.items) {
    bySource[i.source] = (bySource[i.source] ?? 0) + 1;
    for (const c of i.categories ?? []) {
      byCategory[c] = (byCategory[c] ?? 0) + 1;
    }
  }
  return { total, trending, bySource, byCategory };
}

/** NL/EN labels for the standardized categories — keep in sync with whotofollow. */
export const categoryLabels: Record<string, { nl: string; en: string }> = {
  claude: { nl: 'Claude', en: 'Claude' },
  coding: { nl: 'Coding', en: 'Coding' },
  agents: { nl: 'Agents', en: 'Agents' },
  beginners: { nl: 'Beginners', en: 'Beginners' },
  business: { nl: 'Business', en: 'Business' },
  research: { nl: 'Research', en: 'Research' },
  creative: { nl: 'Creatief', en: 'Creative' },
  fundamentals: { nl: 'Fundamenten', en: 'Fundamentals' },
  'tool-insights': { nl: 'Tool-inzichten', en: 'Tool insights' },
  official: { nl: 'Officieel', en: 'Official' },
  branding: { nl: 'Personal brand', en: 'Personal brand' },
};

export function categoryLabel(key: string, locale: 'nl' | 'en' = 'nl'): string {
  const c = categoryLabels[key];
  return c ? c[locale] : key;
}

import { useTranslations, type Locale } from '../i18n/messages';

export function relativeTime(iso?: string | null, locale: Locale = 'nl'): string {
  if (!iso) return '';
  const t = new Date(iso).getTime();
  if (!t) return '';
  const T = useTranslations(locale).time;
  const diff = Date.now() - t;
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}${T.m}`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}${T.h}`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}${T.d}`;
  const mo = Math.floor(d / 30);
  return `${mo}${T.mo}`;
}

export function formatNumber(n?: number): string {
  if (n == null || isNaN(n)) return '0';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export const sourceLabels: Record<string, string> = {
  huggingface: 'HuggingFace',
  github: 'GitHub',
  producthunt: 'Product Hunt',
};

export const typeLabels: Record<string, string> = {
  model: 'Model',
  space: 'Space',
  repo: 'Repo',
  product: 'Product',
};
