/**
 * Roundups — evergreen, indexeerbare aggregatie-pagina's.
 *
 * In tegenstelling tot de losse item-stubs (/hf-*, /ph-*, …, op noindex omdat
 * ze dunne spiegels zijn) zijn dit gecureerde overzichtspagina's met een
 * stabiele URL die *ter plekke* ververst zodra de feed-data ververst. Eén
 * pagina per bron/scope, met redactionele framing + live aggregaat-cijfers →
 * uniek en zoekwaardig ("nieuwe AI-modellen", "trending AI github", …).
 */
import { getAllItems, getBySource } from './data';
import type { FeedItem, FeedSource } from '../types/feed';

export interface RoundupCopy {
  /** Korte bovenkop boven de H1 */
  kicker: string;
  /** H1 */
  title: string;
  /** Meta-description + redactionele intro-zin (geen hype) */
  lead: string;
}

export interface RoundupConfig {
  slug: string;
  /** 'trending' = alle bronnen, alleen is_trending; anders één bron. */
  scope: FeedSource | 'trending';
  /** Lucide-icoonnaam voor de hero (string, component-mapping in de page). */
  icon: 'flame' | 'boxes' | 'github' | 'rocket';
  nl: RoundupCopy;
  en: RoundupCopy;
}

/** Per bron de stat waarop we sorteren + het label ervan. */
const PRIMARY_STAT: Record<string, { key: string; nl: string; en: string }> = {
  huggingface: { key: 'downloads', nl: 'downloads', en: 'downloads' },
  github: { key: 'stars', nl: 'sterren', en: 'stars' },
  producthunt: { key: 'votes', nl: 'votes', en: 'votes' },
};

export const ROUNDUPS: RoundupConfig[] = [
  {
    slug: 'trending',
    scope: 'trending',
    icon: 'flame',
    nl: {
      kicker: 'Trending nu',
      title: 'Trending AI: modellen, tools & repos die nu opvallen',
      lead: 'De AI-launches die op dit moment het hardst stijgen — modellen, tools en repositories met de meeste tractie uit HuggingFace, Product Hunt en GitHub, dagelijks bijgewerkt.',
    },
    en: {
      kicker: 'Trending now',
      title: 'Trending AI: models, tools & repos gaining traction',
      lead: 'The AI launches climbing fastest right now — models, tools and repositories with the most traction across HuggingFace, Product Hunt and GitHub, updated daily.',
    },
  },
  {
    slug: 'ai-modellen',
    scope: 'huggingface',
    icon: 'boxes',
    nl: {
      kicker: 'HuggingFace',
      title: 'Nieuwe & trending AI-modellen op HuggingFace',
      lead: 'Een dagelijks bijgewerkt overzicht van de meest gedownloade en trending open AI-modellen op HuggingFace — van taalmodellen tot beeld- en spraakmodellen, met downloads en likes.',
    },
    en: {
      kicker: 'HuggingFace',
      title: 'New & trending AI models on HuggingFace',
      lead: 'A daily-updated overview of the most downloaded and trending open AI models on HuggingFace — from LLMs to image and speech models, with downloads and likes.',
    },
  },
  {
    slug: 'ai-repos',
    scope: 'github',
    icon: 'github',
    nl: {
      kicker: 'GitHub',
      title: 'Trending AI-repositories op GitHub',
      lead: 'De AI- en machine-learning repositories die op GitHub het snelst sterren verzamelen — frameworks, agents en tools, dagelijks bijgewerkt met sterren-groei.',
    },
    en: {
      kicker: 'GitHub',
      title: 'Trending AI repositories on GitHub',
      lead: 'The AI and machine-learning repositories gaining stars fastest on GitHub — frameworks, agents and tools, updated daily with star growth.',
    },
  },
  {
    slug: 'ai-launches',
    scope: 'producthunt',
    icon: 'rocket',
    nl: {
      kicker: 'Product Hunt',
      title: 'Nieuwe AI-tools & launches op Product Hunt',
      lead: 'De nieuwste AI-producten die op Product Hunt lanceren — apps, agents en tools, gerangschikt op votes en dagelijks bijgewerkt.',
    },
    en: {
      kicker: 'Product Hunt',
      title: 'New AI tools & launches on Product Hunt',
      lead: 'The newest AI products launching on Product Hunt — apps, agents and tools, ranked by votes and updated daily.',
    },
  },
];

export function getRoundupConfig(slug: string): RoundupConfig | undefined {
  return ROUNDUPS.find((r) => r.slug === slug);
}

export interface RoundupData {
  items: FeedItem[];
  total: number;
  trending: number;
  top: FeedItem | null;
  statKey: string | null;
  statLabel: { nl: string; en: string } | null;
}

/** Bouwt de gecureerde lijst + aggregaat-cijfers voor een roundup. */
export function getRoundupData(cfg: RoundupConfig, limit = 60): RoundupData {
  const pool = cfg.scope === 'trending'
    ? getAllItems().filter((i) => i.is_trending)
    : getBySource(cfg.scope, 1000);

  const stat = cfg.scope === 'trending' ? null : PRIMARY_STAT[cfg.scope] ?? null;
  const statKey = stat?.key ?? null;

  const sorted = [...pool].sort((a, b) => {
    if (statKey) return (b.stats?.[statKey] ?? 0) - (a.stats?.[statKey] ?? 0);
    return (a.trending_rank ?? 9999) - (b.trending_rank ?? 9999);
  });

  return {
    items: sorted.slice(0, limit),
    total: pool.length,
    trending: pool.filter((i) => i.is_trending).length,
    top: sorted[0] ?? null,
    statKey,
    statLabel: stat ? { nl: stat.nl, en: stat.en } : null,
  };
}
