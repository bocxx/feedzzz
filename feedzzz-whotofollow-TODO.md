# Feedzzz + Whotofollow — Roadmap & TODO

Gestart 2026-05-05, status na sessie van 2026-05-06.

Twee Astro-sites die data uit NewsFlux verbruiken:
- `feedzzz.online` — discovery feed (HF launches + PH + GH trending)
- `whotofollow.online` — creator directory met curator-picks + auto-categorisering + 2D/3D visualisaties

---

## ✅ Status na 6 mei 2026

### Sites
- **feedzzz.online** — 1004 pagina's (502 NL + 502 EN), Astro v6, Ember-thema (hue 25°), categorie-filter live
- **whotofollow.online** — 1604 pagina's (798 + 798 + over + network + galaxy in NL+EN), Violet-thema (hue 270°), 2-dimensionale filter (scope AND category), Three.js galaxy met quest-interface, D3 network met search

### NewsFlux uitbreidingen
- 5 nieuwe fetchers: `huggingface_fetcher.py`, `producthunt_fetcher.py`, `github_user_enricher.py`, `youtube_channel_enricher.py`, `brand_logo_fetcher.py`
- Curator picks: 39 handles in `data/curated_picks.json` + `curated_picks_fetcher.py` met twitterapi.io backfill
- `categorize_creators.py` (rules) + `categorize_creators_llm.py` (Haiku ~$0.12/run)
- Cron op zondag 04:30-04:50 voor wekelijkse re-tagging
- Quality filter: 183 off-topic Twitter accounts gedropt
- 800 creators in whotofollow, 50% met categorie-tags
- Tweetalig (NL/EN) met hreflang + locale-aware paden

### Tabellen toegevoegd in DuckDB
- `huggingface_models_snapshots`, `huggingface_spaces_snapshots`
- `producthunt_posts`
- `github_users`
- `youtube_channels`, `youtube_channel_aliases`, `youtube_likes_flat`
- `tool_logos`
- `curator_picks`
- `creator_categories` (3.794 entries: rules + LLM)

---

## 🔴 High priority (volgende sessie)

### 1. LinkedIn-cron repareren
- Geen LinkedIn-data sinds 16 april 2026
- Bestand: `src/linkedin.py` (Playwright)
- Mogelijk verlopen cookies, of Playwright-driver gebroken
- Test: `cd /Users/nerd/Projects/DEPLOYED/newsflux && source venv/bin/activate && python3 src/linkedin.py`
- Als Playwright fout: `playwright install chromium`

### 2. HuggingFace fetcher in pipeline wiren
- `huggingface_fetcher.py --capture` is geschreven maar nog **niet** automatisch in de daily cron
- Wel in `pipeline.py:271` staat de hook al — verifiëren dat hij draait in `run.py full`
- Anders aparte cron-entry toevoegen

### 3. Categorie-overzichtspagina's voor whotofollow
- Routes: `/onderwerp/agents`, `/onderwerp/claude`, `/onderwerp/coding`, etc. (en EN: `/en/topic/agents`)
- Per pagina: editor's picks in die categorie + top 50 creators + recente launches
- 11 categorieën × 2 talen = 22 nieuwe SEO-landingspagina's
- Programmatic SEO win + UX win
- Data: `whotofollow_creators.json` filteren op `tags.includes(cat)`, `feedzzz_items.json` voor recente launches

---

## 🟡 Medium priority

### 4. AI Launch heatmap op feedzzz
- GitHub-style 90-day kalender (één cel per dag, kleur = aantal launches)
- Klik op een dag → filter feed naar die dag
- Alle data al in JSON: `huggingface_models_snapshots.created_at`, `producthunt_posts.created_at`, `github_trending_snapshots.snapshot_date`
- Plek: feedzzz homepage of `/launches/calendar`

### 5. Per-creator radar chart op whotofollow detail-pages
- Gebruik `creator_categories.scores` (al in DB)
- D3 radar met 11 categorieën als assen
- Visualiseert "deze persoon staat sterk op claude+coding+agents" in één oogopslag
- Hetzelfde data-model voor toekomstige podcasts/Substack-creators

### 6. Hype-cycle / Gartner-curve visualisatie
- Data: `trend_narratives_v2.lifecycle_phase` (`weak_signal`, `emerging`, `accelerating`, `peaking`, `sustained`, `declining`, `faded`)
- Plot keywords op klassieke hype-curve
- Zeer deelbaar als infographic — past bij feedzzz of nieuwe shared `/trends`-pagina
- Hetlaatsteainieuws heeft al `hype_meter.json` voor input

### 7. Niche-tier pill levendiger bij whotofollow detail-page
- Op de detail-pagina is de niche-pill nu redelijk subtiel — kan rijker

### 8. Sparkline op category-pills
- Tiny line-chart binnen elke filter-pill die toont of dat onderwerp deze week rijst of daalt
- Data uit `trend_snapshots` per dag per keyword
- Maakt de filter zelf informatief

### 9. Cron toevoegen om feedzzz items te categoriseren
- Nu wordt categorisering applied tijdens export
- Geen extra cron nodig, maar wel goed checken dat het in de zondag-flow draait

---

## 🟢 Low priority / nice-to-have

### 10. Galaxy polish-extras
- "Vlieg-pad" deeltjestrail tijdens de tween (visuele streak achter de camera)
- Mini-radar in de hoek met dot-positie van quest-target
- Auto-suggest dropdown onder search-veld voor multi-match
- Avatar-textures op picks (load real avatar URL als sprite-textuur, alleen voor de 38 picks)

### 11. Network polish-extras
- Avatar sprites in plaats van solid circles voor picks
- Smooth zoom-animaties bij filter-state changes

### 12. Sankey-diagram
- Bron (HF / GH / PH) → Categorie → Item
- Op dedicated `/flow`-pagina

### 13. Substack uitbreiden
- Nu 4 feeds — uitbreiden naar 20-30 publications
- Ruben Hassid, Zvi Mowshowitz, Excellent AI Prompts (al binnen)
- Nieuwe candidates: Lenny's Newsletter, AI Tidbits, Ben's Bites
- Eventueel YouTube OAuth flow alsnog implementeren via `src/youtube_likes_fetcher.py` (`--auth`)

### 14. Cross-platform identity-merge verfijnen
- Nu rough op `twitter_username`-veld in `github_users`
- Uitbreiden naar bio-mining (regex op Twitter-bio voor GH/blog/website URLs)
- Voor Karpathy werkt het via dedup — voor anderen zou een resolver fijner zijn

### 15. Niche-tagger uitbreiden
- Auto-tagging dekt nu 50% van whotofollow
- 50% zonder tag is vooral GitHub-orgs zonder bio (Microsoft, Google) en YouTube-channels zonder beschrijving
- Optie: tag GH-orgs op basis van hun trending repo descriptions (we hebben `github_trending_snapshots`)
- Optie: YouTube channels op basis van recente video-titels (vereist `playlistItems` fetch — ~10K quota voor alle 211 channels)

### 16. PerformanceObserver / metrics
- Cloudflare adapter is nu in de config (conditional dev/build) — actuele deploys zijn nog niet gemaakt
- Pagefind search toevoegen voor in-site search (zoals dbat)
- OG-images via Satori (ook zoals dbat)

---

## 🔧 Bekende issues

- **`rileybrown_ai`** zit in curator picks JSON maar bestaat niet meer op Twitter — twitterapi.io geeft "user not found". Kan handmatig uit `data/curated_picks.json` worden verwijderd.
- **DuckDB single-writer**: bij parallel draaien van fetcher + manual `duckdb` CLI komen lock-conflicten voor. `categorize_creators.py` heeft retry-logic; let op bij anderen.
- **Empty bio creators in directory**: ~470 creators (vooral GH-orgs) hebben geen bio dus geen tags. Niet kritisch maar gat in de UX. Zie #15.

---

## 📁 Belangrijke bestanden

### NewsFlux
| Bestand | Doel |
|---|---|
| `src/export_for_sites.py` | Exporteert `feedzzz_items.json` + `whotofollow_creators.json` (eventueel `--copy-to-sites`) |
| `src/categorize_creators.py` | Rules-based categoriseren (gratis) |
| `src/categorize_creators_llm.py` | Haiku LLM top-up (~$0.12) |
| `src/curated_picks_fetcher.py` | Backfill via twitterapi.io |
| `data/curated_picks.json` | 39 handmatig gecureerde X-handles |
| `crontab.txt` | Wekelijkse cron op zondag 04:30-04:50 |

### feedzzz.online
| Bestand | Doel |
|---|---|
| `src/data/feedzzz_items.json` | Live feed data (gekopieerd door newsflux exporter) |
| `src/pages/index.astro` (NL) en `src/pages/en/index.astro` | Homepage met 2-dim filter |
| `src/styles/tokens.css` | Ember-thema (hue 25°) |
| `src/i18n/messages.ts` | NL + EN translations |

### whotofollow.online
| Bestand | Doel |
|---|---|
| `src/data/whotofollow_creators.json` | Live creator data (38 curator picks + 762 algoritmisch) |
| `src/pages/index.astro` (NL) en `src/pages/en/index.astro` | Homepage met 2-dim filter |
| `src/pages/network.astro` | D3 2D force-graph met search + neighborhood highlight |
| `src/pages/galaxy.astro` | Three.js 3D quest-interface met bloom, orbits, multi-cat lines |
| `src/components/molecules/CreatorCard.astro` | Card met tier-pill, editor note, category chips |
| `src/styles/tokens.css` | Violet-thema (hue 270°) |
| `src/styles/base.css` | Cat-chip palette + cat-pill filter styles |

---

## 🚀 Quick-start voor nieuwe sessie

```bash
# Context terugkrijgen
cat /Users/nerd/Projects/DEPLOYED/feedzzz-whotofollow-TODO.md

# Sites lokaal draaien
cd /Users/nerd/Projects/DEPLOYED/feedzzz.online && npm run dev
# (andere terminal)
cd /Users/nerd/Projects/DEPLOYED/whotofollow.online && npm run dev -- --port 4322

# Newsflux data refresh
cd /Users/nerd/Projects/DEPLOYED/newsflux && source venv/bin/activate
python3 src/categorize_creators.py            # rules
python3 src/export_for_sites.py               # initial export
python3 src/categorize_creators_llm.py        # LLM top-up
python3 src/export_for_sites.py --copy-to-sites  # final export → sites
```

URLs in dev:
- feedzzz: http://localhost:4321 (NL), http://localhost:4321/en/ (EN)
- whotofollow: http://localhost:4322, /network, /galaxy
