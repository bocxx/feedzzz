export type FeedSource = 'huggingface' | 'github' | 'producthunt';
export type FeedItemType = 'model' | 'space' | 'repo' | 'product';

export interface FeedItem {
  id: string;
  type: FeedItemType;
  source: FeedSource;
  title: string;
  tagline: string;
  description?: string;
  author: string;
  url: string;
  website?: string | null;
  domain?: string | null;
  logo?: string | null;
  language?: string | null;
  library?: string | null;
  tags: string[];
  categories?: string[];
  stats: Record<string, number>;
  is_trending?: boolean;
  trending_rank?: number | null;
  ai_relevant?: boolean;
  ai_keywords?: string[];
  ai_relevance_score?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface FeedPayload {
  generated_at: string;
  count: number;
  items: FeedItem[];
}
