/**
 * Categorie-hubs — statische, indexeerbare pagina's per onderwerp.
 *
 * De categorieën bestonden alleen als JS-filters op de homepage (onzichtbaar
 * voor crawlers). Deze module voedt /categorie/[cat]/ (NL) en
 * /en/category/[cat]/ (EN): per categorie een eigen URL, unieke title/lead en
 * CollectionPage-JSON-LD — zelfde patroon als de roundup-pagina's.
 * Volgorde en set identiek aan CATEGORY_ORDER op de homepage.
 */
import { getAllItems } from './data';
import type { FeedItem } from '../types/feed';

export const CATEGORY_ORDER = [
  'claude', 'coding', 'agents', 'tool-insights', 'fundamentals',
  'research', 'business', 'creative', 'beginners', 'branding', 'official',
] as const;

export type CategorySlug = (typeof CATEGORY_ORDER)[number];

export interface CategoryCopy {
  /** Korte bovenkop boven de H1 */
  kicker: string;
  /** H1, keyword-eerst */
  title: string;
  /** Meta-description + intro (geen hype) */
  lead: string;
}

export interface CategoryPageConfig {
  /** Lucide-icoonnaam (mapping naar component in de page) */
  icon: 'sparkles' | 'code' | 'bot' | 'wrench' | 'graduationcap' | 'microscope'
    | 'briefcase' | 'palette' | 'bookopen' | 'megaphone' | 'shieldcheck';
  nl: CategoryCopy;
  en: CategoryCopy;
}

export const CATEGORY_PAGES: Record<CategorySlug, CategoryPageConfig> = {
  claude: {
    icon: 'sparkles',
    nl: {
      kicker: 'Claude',
      title: 'Claude-tools, agents & repos: nieuwe launches',
      lead: 'Alles rond Claude en Anthropic in één overzicht — nieuwe tools, agents, integraties en repositories uit HuggingFace, Product Hunt en GitHub, doorlopend ververst.',
    },
    en: {
      kicker: 'Claude',
      title: 'Claude tools, agents & repos: new launches',
      lead: 'Everything around Claude and Anthropic in one overview — new tools, agents, integrations and repositories from HuggingFace, Product Hunt and GitHub, continuously refreshed.',
    },
  },
  coding: {
    icon: 'code',
    nl: {
      kicker: 'Coding',
      title: 'AI-codingtools: nieuwe launches voor developers',
      lead: 'Nieuwe AI-tools voor developers — code-assistenten, IDE-integraties, frameworks en libraries die nu lanceren op HuggingFace, Product Hunt en GitHub.',
    },
    en: {
      kicker: 'Coding',
      title: 'AI coding tools: new launches for developers',
      lead: 'New AI tools for developers — code assistants, IDE integrations, frameworks and libraries launching now on HuggingFace, Product Hunt and GitHub.',
    },
  },
  agents: {
    icon: 'bot',
    nl: {
      kicker: 'Agents',
      title: 'AI-agents: nieuwe frameworks, tools & launches',
      lead: 'De nieuwste AI-agents en agent-frameworks — autonome tools, orchestratie-libraries en agent-launches uit HuggingFace, Product Hunt en GitHub trending.',
    },
    en: {
      kicker: 'Agents',
      title: 'AI agents: new frameworks, tools & launches',
      lead: 'The newest AI agents and agent frameworks — autonomous tools, orchestration libraries and agent launches from HuggingFace, Product Hunt and GitHub trending.',
    },
  },
  'tool-insights': {
    icon: 'wrench',
    nl: {
      kicker: 'Tool-inzichten',
      title: 'Tool-inzichten: nieuwe AI-tools & workflows',
      lead: 'AI-tools die laten zien hoe het werkt — utilities, workflow-tools en praktische launches waaruit je iets leert over het bouwen en gebruiken van AI.',
    },
    en: {
      kicker: 'Tool insights',
      title: 'Tool insights: new AI tools & workflows',
      lead: 'AI tools that show how it works — utilities, workflow tools and practical launches that teach you something about building and using AI.',
    },
  },
  fundamentals: {
    icon: 'graduationcap',
    nl: {
      kicker: 'Fundamenten',
      title: 'AI-fundamenten: modellen, frameworks & infrastructuur',
      lead: 'De bouwstenen van AI — nieuwe basismodellen, trainings-frameworks, inference-tools en infrastructuur uit HuggingFace, Product Hunt en GitHub.',
    },
    en: {
      kicker: 'Fundamentals',
      title: 'AI fundamentals: models, frameworks & infrastructure',
      lead: 'The building blocks of AI — new base models, training frameworks, inference tools and infrastructure from HuggingFace, Product Hunt and GitHub.',
    },
  },
  research: {
    icon: 'microscope',
    nl: {
      kicker: 'Research',
      title: 'AI-research: nieuwe modellen & paper-implementaties',
      lead: 'Onderzoeksgedreven AI-launches — nieuwe researchmodellen, benchmarks en implementaties van papers, verzameld uit HuggingFace en GitHub trending.',
    },
    en: {
      kicker: 'Research',
      title: 'AI research: new models & paper implementations',
      lead: 'Research-driven AI launches — new research models, benchmarks and paper implementations, collected from HuggingFace and GitHub trending.',
    },
  },
  business: {
    icon: 'briefcase',
    nl: {
      kicker: 'Business',
      title: 'AI voor business: nieuwe zakelijke tools & launches',
      lead: 'Nieuwe AI-tools voor werk en bedrijf — productiviteit, sales, marketing en operations, met de launches die nu tractie krijgen op Product Hunt en GitHub.',
    },
    en: {
      kicker: 'Business',
      title: 'AI for business: new work tools & launches',
      lead: 'New AI tools for work and business — productivity, sales, marketing and operations, with the launches gaining traction on Product Hunt and GitHub.',
    },
  },
  creative: {
    icon: 'palette',
    nl: {
      kicker: 'Creatief',
      title: 'Creatieve AI: beeld-, audio-, video- & designtools',
      lead: 'AI voor makers — nieuwe beeld-, audio-, video- en designmodellen en -tools, van generatieve modellen op HuggingFace tot creatieve launches op Product Hunt.',
    },
    en: {
      kicker: 'Creative',
      title: 'Creative AI: image, audio, video & design tools',
      lead: 'AI for makers — new image, audio, video and design models and tools, from generative models on HuggingFace to creative launches on Product Hunt.',
    },
  },
  beginners: {
    icon: 'bookopen',
    nl: {
      kicker: 'Beginners',
      title: 'AI voor beginners: toegankelijke tools & leerbronnen',
      lead: 'Laagdrempelige AI-launches — tools, tutorials en repositories waarmee je zonder diepe voorkennis met AI aan de slag kunt, doorlopend bijgewerkt.',
    },
    en: {
      kicker: 'Beginners',
      title: 'AI for beginners: accessible tools & learning resources',
      lead: 'Approachable AI launches — tools, tutorials and repositories to get started with AI without deep prior knowledge, continuously updated.',
    },
  },
  branding: {
    icon: 'megaphone',
    nl: {
      kicker: 'Personal brand',
      title: 'Personal branding met AI: content- & profieltools',
      lead: 'AI-tools voor je zichtbaarheid — content-creatie, social media en personal-branding-launches die nu opduiken op Product Hunt en GitHub.',
    },
    en: {
      kicker: 'Personal brand',
      title: 'Personal branding with AI: content & profile tools',
      lead: 'AI tools for your visibility — content creation, social media and personal-branding launches surfacing on Product Hunt and GitHub right now.',
    },
  },
  official: {
    icon: 'shieldcheck',
    nl: {
      kicker: 'Officieel',
      title: 'Officiële AI-releases: modellen & tools van de labs',
      lead: 'Releases van de officiële partijen zelf — modellen, tools en repositories van AI-labs en grote platformen, rechtstreeks uit de bron.',
    },
    en: {
      kicker: 'Official',
      title: 'Official AI releases: models & tools from the labs',
      lead: 'Releases from the official parties themselves — models, tools and repositories from AI labs and major platforms, straight from the source.',
    },
  },
};

/** Alle items in een categorie, in feed-volgorde (export sorteert al op relevantie). */
export function getCategoryItems(cat: string): FeedItem[] {
  return getAllItems().filter((i) => (i.categories ?? []).includes(cat));
}

/** Localized pad naar een categorie-hub (mét trailing slash, zie trailingSlash:'always'). */
export function categoryHref(cat: string, locale: 'nl' | 'en'): string {
  return locale === 'nl' ? `/categorie/${cat}/` : `/en/category/${cat}/`;
}
